from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth.models import User
from .models import Category, Product, UserProfile, Wishlist, Report, Review

class ReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'seller', 'buyer', 'buyer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['buyer']

class ReportSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    reporter_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'product', 'product_title', 'reporter_email', 'reason', 'description', 'status', 'admin_note', 'created_at', 'resolved_at']
        read_only_fields = ['created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    image = Base64ImageField(required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'title', 'slug', 'description', 
            'price', 'image', 'image_url', 'condition', 'location', 
            'seller_name', 'seller_email', 'is_local', 'is_durable', 
            'co2_footprint', 'stock', 'is_active', 'created_at', 'updated_at'
        ]

class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_details', 'created_at']
        read_only_fields = ['user']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'role', 'full_name', 'phone', 'address', 'city', 
            'country', 'postal_code', 'bio', 'avatar', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        if profile_data is not None:
            profile = getattr(instance, 'profile', None)
            if profile:
                for field in ['full_name', 'phone', 'address', 'city', 'country', 'postal_code', 'bio']:
                    if field in profile_data:
                        setattr(profile, field, profile_data[field])
                request = self.context.get('request')
                if request and request.user.is_staff and 'role' in profile_data:
                    profile.role = profile_data['role']
                profile.save()
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, write_only=True)
    full_name = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False)
    city = serializers.CharField(write_only=True, required=False)
    country = serializers.CharField(write_only=True, required=False)
    postal_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'password', 'email', 'role', 'full_name',
            'phone', 'address', 'city', 'country', 'postal_code'
        ]

    def create(self, validated_data):
        role = validated_data.pop('role', 'buyer')
        full_name = validated_data.pop('full_name', '')
        phone = validated_data.pop('phone', '')
        address = validated_data.pop('address', '')
        city = validated_data.pop('city', '')
        country = validated_data.pop('country', '')
        postal_code = validated_data.pop('postal_code', '')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()
            
        profile = user.profile
        profile.role = role
        profile.full_name = full_name
        profile.phone = phone
        profile.address = address
        profile.city = city
        profile.country = country
        profile.postal_code = postal_code
        profile.save()
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
