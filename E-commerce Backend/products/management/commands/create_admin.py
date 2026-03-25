from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import UserProfile


class Command(BaseCommand):
    help = 'Create an admin user'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin', help='Admin username')
        parser.add_argument('--email', type=str, default='admin@example.com', help='Admin email')
        parser.add_argument('--password', type=str, default='admin123', help='Admin password')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': email, 'is_staff': True, 'is_superuser': True}
        )

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Admin user "{username}" created'))
        else:
            user.is_staff = True
            user.is_superuser = True
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Admin user "{username}" updated'))

        profile, profile_created = UserProfile.objects.get_or_create(
            user=user,
            defaults={'role': 'admin', 'full_name': 'Administrator'}
        )

        if not profile_created:
            profile.role = 'admin'
            profile.full_name = 'Administrator'
            profile.save()
            self.stdout.write(self.style.SUCCESS(f'Profile updated for "{username}"'))

        self.stdout.write(self.style.SUCCESS('\n=== Admin Login Credentials ==='))
        self.stdout.write(f'Username: {username}')
        self.stdout.write(f'Password: {password}')
        self.stdout.write(f'Email: {email}')
        self.stdout.write('================================\n')
        self.stdout.write(f'Django Admin: http://127.0.0.1:8000/admin/')
        self.stdout.write(f'Frontend Login: http://localhost:5173/login')
