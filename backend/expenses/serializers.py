from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Expense, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="User with same credentials already exists.")]
    )
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password_confirm"]
        read_only_fields = ["id"]

    def validate(self, data):
        """Validate that passwords match."""
        password = data.get("password")
        password_confirm = data.pop("password_confirm", None)
        
        if password != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"].strip(),
            email=validated_data.get("email", "").strip(),
            password=validated_data["password"],
        )
        UserProfile.objects.get_or_create(user=user)
        return user


class ExpenseSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Expense
        fields = ["id", "title", "amount", "category", "date", "completed", "created_at", "owner_username"]
        read_only_fields = ["id", "created_at", "owner_username"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["monthly_budget"]
