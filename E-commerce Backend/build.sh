#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Run migrations to update database
python manage.py collectstatic --noinput
python manage.py makemigrations
python manage.py migrate

# Create a superuser programmatically (Optional but helpful for testing on deployment)
# You can login with admin / adminpassword
export DJANGO_SUPERUSER_PASSWORD=adminpassword
export DJANGO_SUPERUSER_EMAIL="admin@example.com"
export DJANGO_SUPERUSER_USERNAME="admin"
python manage.py createsuperuser --noinput || true

echo "Build process completed successfully!"
