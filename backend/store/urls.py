from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, MeView,
    ProfileView, AvatarView, ChangeEmailView, ChangePasswordView,
    ForgotPasswordView, ResetPasswordView,
    CategoryListView, CategoryDetailView,
    ProductListView, ProductDetailView, ReviewCreateView,
    ProductImageListView, ProductImageDetailView,
)

urlpatterns = [
    path('auth/register/',        RegisterView.as_view()),
    path('auth/login/',           LoginView.as_view()),
    path('auth/logout/',          LogoutView.as_view()),
    path('auth/me/',              MeView.as_view()),
    path('auth/profile/',         ProfileView.as_view()),
    path('auth/avatar/',          AvatarView.as_view()),
    path('auth/change-email/',    ChangeEmailView.as_view()),
    path('auth/change-password/', ChangePasswordView.as_view()),
    path('auth/forgot-password/', ForgotPasswordView.as_view()),
    path('auth/reset-password/',  ResetPasswordView.as_view()),

    path('categories/',          CategoryListView.as_view()),
    path('categories/<int:pk>/', CategoryDetailView.as_view()),

    path('products/',                      ProductListView.as_view()),
    path('products/<int:pk>/',             ProductDetailView.as_view()),
    path('products/<int:pk>/reviews/',     ReviewCreateView.as_view()),
    path('products/<int:pk>/images/',      ProductImageListView.as_view()),

    path('images/<int:pk>/',               ProductImageDetailView.as_view()),
]
