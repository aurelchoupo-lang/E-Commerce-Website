from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from products.models import Category, Product, Report, Wishlist

class BackendOfflineTests(APITestCase):
    
    def setUp(self):
        # Create standard test data
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        
    def test_01_create_normal_user_and_login(self):
        """Test user registration and token retrieval offline"""
        res = self.client.post('/api/register/', {
            'username': 'buyer@test.com', 'email': 'buyer@test.com',
            'password': 'password123', 'role': 'buyer', 'full_name': 'Test Buyer'
        }, format='json')
        self.assertEqual(res.status_code, 201)
        
        login_res = self.client.post('/api/login/', {
            'username': 'buyer@test.com',
            'password': 'password123'
        }, format='json')
        self.assertEqual(login_res.status_code, 200)
        self.assertIn('token', login_res.data)

    def test_02_create_admin_user_has_staff_perms(self):
        """Test admin role assignment translates to is_staff=True"""
        self.client.post('/api/register/', {
            'username': 'admin@test.com', 'email': 'admin@test.com',
            'password': 'password123', 'role': 'admin', 'full_name': 'Test Admin'
        }, format='json')
        
        user = User.objects.get(username='admin@test.com')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_03_create_product_listing(self):
        """Test authenticated product creation with category resolution"""
        user = User.objects.create_user(username='seller@test.com', password='password123')
        self.client.force_authenticate(user=user)
        
        res = self.client.post('/api/products/', {
            'title': 'Test Phone',
            'description': 'A nice phone',
            'price': '499.99',
            'category': 'Electronics',
            'condition': 'New',
            'location': 'Local Offline'
        }, format='json')
        
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(Product.objects.first().category.slug, 'electronics')

    def test_04_product_deletion_protection(self):
        """Test that unauthorized users are forbidden from deleting others' products"""
        owner = User.objects.create_user(username='owner@test.com', password='password123')
        hacker = User.objects.create_user(username='hacker@test.com', password='password123')
        
        product = Product.objects.create(title="My Phone", price="100.00", category=self.category, seller=owner)
        
        # Authenticate as hacker, try deleting owner's product
        self.client.force_authenticate(user=hacker)
        res = self.client.delete(f'/api/products/{product.id}/')
        
        self.assertEqual(res.status_code, 403) # Forbidden
        self.assertEqual(Product.objects.count(), 1) # Item remains

    def test_05_update_self_profile(self):
        """Test users can update their own nested profile data"""
        user = User.objects.create_user(username='buyer2@test.com', password='password123')
        self.client.force_authenticate(user=user)
        
        res = self.client.patch(f'/api/users/{user.id}/', {
            'profile': {'full_name': 'New Updated Name'}
        }, format='json')
        
        self.assertEqual(res.status_code, 200)
        user.profile.refresh_from_db()
        self.assertEqual(user.profile.full_name, 'New Updated Name')

    def test_06_filter_products_by_category(self):
        """Test django-filters translates ?category=slug properly"""
        Product.objects.create(title="Phone", price="100.00", category=self.category)
        
        res = self.client.get('/api/products/?category=electronics')
        self.assertEqual(res.status_code, 200)
        
        # Assuming pagination 'results' array
        data = res.data.get('results', res.data)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['title'], 'Phone')

    def test_07_prevent_empty_password_change(self):
        """Test password validation logic rejects empty passwords"""
        user = User.objects.create_user(username='pass@test.com', password='password123')
        self.client.force_authenticate(user=user)
        
        res = self.client.post('/api/change-password/', {
            'old_password': 'password123',
            'new_password': ''
        }, format='json')
        
        self.assertEqual(res.status_code, 400)
        self.assertIn('new_password', res.data)

    def test_08_report_system_workflow(self):
        """Test reporting is properly scoped to users and admins"""
        admin = User.objects.create_user(username='admin2@test.com', password='password123', is_staff=True)
        user = User.objects.create_user(username='buyer3@test.com', password='password123')
        
        product = Product.objects.create(title="Spam Item", price="0", category=self.category)
        
        # User submits report
        self.client.force_authenticate(user=user)
        post_res = self.client.post('/api/reports/', {
            'product': product.id,
            'reason': 'Spam',
            'description': 'Fake item!'
        }, format='json')
        self.assertEqual(post_res.status_code, 201)
        report_id = post_res.data['id']
        
        # User cannot change status
        patch_res = self.client.patch(f'/api/reports/{report_id}/', {
            'status': 'resolved'
        }, format='json')
        self.assertEqual(patch_res.status_code, 403) # standard users cannot update
        
        # Admin can resolve
        self.client.force_authenticate(user=admin)
        admin_patch = self.client.patch(f'/api/reports/{report_id}/', {
            'status': 'resolved',
            'admin_note': 'Looked into it'
        }, format='json')
        
        self.assertEqual(admin_patch.status_code, 200)
        self.assertEqual(admin_patch.data['status'], 'resolved')
