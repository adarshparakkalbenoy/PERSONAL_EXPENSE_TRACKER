from django.conf import settings
from django.db import models


CATEGORY_CHOICES = [
    ("food", "Food"),
    ("rent", "Rent"),
    ("utilities", "Utilities"),
    ("entertainment", "Entertainment"),
]


class UserProfile(models.Model):
    """Extra per-user settings, created automatically on registration."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=1000)

    def __str__(self):
        return f"{self.user.username} profile"


class Expense(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="expenses"
    )
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="food")
    date = models.DateField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.amount})"
