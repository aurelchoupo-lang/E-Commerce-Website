from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from .models import Category, Product, UserProfile, Wishlist, Report, Review
from .serializers import CategorySerializer, ProductSerializer, RegisterSerializer, UserSerializer, WishlistSerializer, ReportSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.db.models import Avg
from .permissions import IsOwnerOrAdminOrReadOnly, IsBuyerOrAdminOrReadOnly, IsSelfOrAdmin
import django_filters

class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    
    class Meta:
        model = Product
        fields = ['category', 'condition', 'is_local', 'is_durable', 'seller_email']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsBuyerOrAdminOrReadOnly] # Allow everyone to see, only buyer/admin to update/delete
    filterset_fields = ['seller__email']

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [IsAdminUser()]
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsSelfOrAdmin()]
        return [IsAdminUser()]

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not old_password:
            return Response({'old_password': ['Old password is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password:
            return Response({'new_password': ['New password is required.']}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if not user.check_password(old_password):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        password = request.data.get('password')
        user = request.user
        if not user.check_password(password):
            return Response({'password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'message': 'Account deleted'})

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Token.DoesNotExist:
            pass
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError({'detail': 'Item already in wishlist'})

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    
    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_staff', False):
            return Report.objects.all()
        return Report.objects.filter(user=user)

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        if getattr(self.request.user, 'is_staff', False):
            return [IsAuthenticated()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user if self.request.user.is_authenticated else None,
            status='pending',
            admin_note='',
            resolved_at=None
        )

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        from rest_framework.permissions import IsAdminUser
        return [IsAdminUser()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]
    filterset_class = ProductFilter
    search_fields = ['title', 'description', 'seller_name', 'location']
    ordering_fields = ['price', 'created_at', 'title']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(
            seller=user,
            seller_name=user.profile.full_name or user.username,
            seller_email=user.email
        )
