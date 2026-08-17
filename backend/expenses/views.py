from datetime import date
from collections import defaultdict

from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CATEGORY_CHOICES, Expense, UserProfile
from .serializers import ExpenseSerializer, RegisterSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override to provide better error messages."""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Admin / staff sees all expenses across all customers; regular customers see only their own.
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Expense.objects.all().order_by("-date", "-created_at")
        return Expense.objects.filter(owner=self.request.user).order_by("-date", "-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CategorySummaryView(APIView):
    """Totals per category for the current month, feeds the pie chart."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        qs = Expense.objects.filter(
            owner=request.user, date__year=today.year, date__month=today.month
        )
        totals = {key: 0 for key, _ in CATEGORY_CHOICES}
        for row in qs.values("category").annotate(total=Sum("amount")):
            totals[row["category"]] = float(row["total"])
        return Response(totals)


class BudgetStatusView(APIView):
    """Spend vs. the user's monthly budget threshold, for the alert banner."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        today = date.today()
        spent = (
            Expense.objects.filter(
                owner=request.user, date__year=today.year, date__month=today.month
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )
        budget = profile.monthly_budget
        return Response(
            {
                "spent": float(spent),
                "budget": float(budget),
                "over_limit": float(spent) > float(budget),
                "percent_used": round(float(spent) / float(budget) * 100, 1) if budget else 0,
            }
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    """Lets the user view/update their own monthly budget threshold."""

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class DailyTrendsView(APIView):
    """Daily spending trends for the current month, feeds the line/bar chart."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        
        qs = Expense.objects.filter(
            owner=request.user,
            date__year=today.year,
            date__month=today.month
        ).values("date").annotate(total=Sum("amount")).order_by("date")
        
        # Create a dict with all days of month initialized to 0
        days_in_month = 31 if today.month in [1, 3, 5, 7, 8, 10, 12] else 30 if today.month != 2 else 28
        if today.month == 2 and today.year % 4 == 0:
            days_in_month = 29
        
        daily_totals = {i: 0.0 for i in range(1, days_in_month + 1)}
        
        # Fill in actual spending
        for row in qs:
            daily_totals[row["date"].day] = float(row["total"])
        
        return Response(daily_totals)


class MonthComparisonView(APIView):
    """Compare spending: current month vs. last month."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        
        # Current month
        current_month_total = (
            Expense.objects.filter(
                owner=request.user,
                date__year=today.year,
                date__month=today.month
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )
        
        # Last month
        if today.month == 1:
            last_month_date = date(today.year - 1, 12, 1)
        else:
            last_month_date = date(today.year, today.month - 1, 1)
        
        last_month_total = (
            Expense.objects.filter(
                owner=request.user,
                date__year=last_month_date.year,
                date__month=last_month_date.month
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )
        
        # Calculate change
        change_percent = 0
        if last_month_total > 0:
            change_percent = round(((current_month_total - last_month_total) / last_month_total) * 100, 1)
        
        current_month_name = today.strftime("%B %Y")
        last_month_name = last_month_date.strftime("%B %Y")
        
        return Response({
            "current_month": {
                "name": current_month_name,
                "total": float(current_month_total)
            },
            "last_month": {
                "name": last_month_name,
                "total": float(last_month_total)
            },
            "change_percent": change_percent
        })
