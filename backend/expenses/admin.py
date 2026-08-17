from django.contrib import admin
from .models import Expense, UserProfile

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "amount", "category", "owner", "date", "completed", "created_at")
    list_filter = ("category", "completed", "date")
    search_fields = ("title", "owner__username", "category")
    ordering = ("-date", "-created_at")

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "monthly_budget")
    search_fields = ("user__username",)
