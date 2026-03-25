from rest_framework import permissions

class IsOwnerOrAdminOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object (seller) or admins to edit or delete it.
    Assumes the model instance has an `seller` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `seller`.
        if hasattr(obj, 'seller'):
            return obj.seller == request.user or (request.user and request.user.is_staff)
        return False


class IsBuyerOrAdminOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow buyers (reviewers) or admins to edit or delete it.
    Assumes the model instance has a `buyer` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, 'buyer'):
            return obj.buyer == request.user or (request.user and request.user.is_staff)
        return False


class IsSelfOrAdmin(permissions.BasePermission):
    """
    Object-level permission to allow users to edit their own profile,
    or admins to edit any profile. Assumes obj is a User instance.
    """
    def has_object_permission(self, request, view, obj):
        # We don't necessarily allow read-only (list) here, as UserViewSet will handle list permission.
        return obj == request.user or (request.user and request.user.is_staff)
