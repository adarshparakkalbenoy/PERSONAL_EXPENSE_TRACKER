from django.contrib.auth import login
from django.contrib.auth.models import User

class AutoAdminLoginMiddleware:
    """
    Middleware that automatically logs in any visitor accessing /admin/
    as a superuser ('admin') so anyone can enter the admin dashboard directly.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin'):
            if not request.user.is_authenticated or not request.user.is_staff:
                admin_user, created = User.objects.get_or_create(
                    username='admin',
                    defaults={
                        'is_staff': True,
                        'is_superuser': True,
                        'is_active': True,
                        'email': 'admin@example.com',
                    }
                )
                admin_user.is_staff = True
                admin_user.is_superuser = True
                admin_user.is_active = True
                admin_user.set_password('admin')
                admin_user.save()

                admin_user.backend = 'django.contrib.auth.backends.ModelBackend'
                login(request, admin_user)
                request.user = admin_user

        response = self.get_response(request)
        return response
