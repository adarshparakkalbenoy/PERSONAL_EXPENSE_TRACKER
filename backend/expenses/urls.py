from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    BudgetStatusView,
    CategorySummaryView,
    DailyTrendsView,
    ExpenseViewSet,
    MonthComparisonView,
    ProfileView,
    RegisterView,
)

router = DefaultRouter()
router.register(r"expenses", ExpenseViewSet, basename="expense")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("summary/category/", CategorySummaryView.as_view(), name="summary_category"),
    path("summary/daily-trends/", DailyTrendsView.as_view(), name="daily_trends"),
    path("summary/month-comparison/", MonthComparisonView.as_view(), name="month_comparison"),
    path("summary/budget/", BudgetStatusView.as_view(), name="summary_budget"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("", include(router.urls)),
]
