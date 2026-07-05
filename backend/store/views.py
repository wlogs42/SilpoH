from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product, ProductImage, Review, UserProfile
from .serializers import (
    CategorySerializer, ProductSerializer, ProductImageSerializer,
    RegisterSerializer, ReviewSerializer,
    ProfileSerializer, ChangeEmailSerializer, ChangePasswordSerializer,
)



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user  = serializer.save()
            token = Token.objects.create(user=user)
            return Response({
                'token':    token.key,
                'user_id':  user.pk,
                'username': user.username,
                'email':    user.email,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if '@' in username:
            try:
                username = User.objects.get(email__iexact=username).username
            except User.DoesNotExist:
                pass

        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token':    token.key,
                'user_id':  user.pk,
                'username': user.username,
            })
        return Response({'error': 'Невірний логін або пароль'},
                        status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        User = get_user_model()
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': 'Якщо такий email існує — лист надіслано'})

        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        link  = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        send_mail(
            subject='Відновлення пароля — Silpo',
            message=f'Привіт, {user.username}!\n\nПосилання для скидання пароля:\n{link}\n\nПосилання діє 24 години.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        return Response({'detail': 'Якщо такий email існує — лист надіслано'})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid          = request.data.get('uid', '')
        token        = request.data.get('token', '')
        new_password = request.data.get('new_password', '')

        if len(new_password) < 6:
            return Response({'error': 'Пароль мінімум 6 символів'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        try:
            pk   = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=pk)
        except Exception:
            return Response({'error': 'Невірне посилання'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Посилання недійсне або застаріло'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Пароль змінено успішно'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user
        avatar_url = None
        try:
            if u.profile.avatar:
                avatar_url = request.build_absolute_uri(u.profile.avatar.url)
        except UserProfile.DoesNotExist:
            pass
        return Response({
            'user_id':   u.pk,
            'username':  u.username,
            'email':     u.email,
            'is_staff':  u.is_staff,
            'avatar_url': avatar_url,
        })


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        s = ProfileSerializer(request.user, context={'request': request})
        return Response(s.data)

    def patch(self, request):
        s = ProfileSerializer(request.user, data=request.data,
                              partial=True, context={'request': request})
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class AvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        if 'avatar' not in request.FILES:
            return Response({'error': 'Файл не передано'}, status=status.HTTP_400_BAD_REQUEST)
        if profile.avatar:
            profile.avatar.delete(save=False)
        profile.avatar = request.FILES['avatar']
        profile.save()
        avatar_url = request.build_absolute_uri(profile.avatar.url)
        return Response({'avatar_url': avatar_url})

    def delete(self, request):
        try:
            profile = request.user.profile
            if profile.avatar:
                profile.avatar.delete(save=False)
                profile.save()
        except UserProfile.DoesNotExist:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = ChangeEmailSerializer(data=request.data, context={'request': request})
        if s.is_valid():
            request.user.email = s.validated_data['email']
            request.user.save()
            return Response({'email': request.user.email})
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = ChangePasswordSerializer(data=request.data, context={'request': request})
        if s.is_valid():
            request.user.set_password(s.validated_data['new_password'])
            request.user.save()
            from rest_framework.authtoken.models import Token
            Token.objects.filter(user=request.user).delete()
            token = Token.objects.create(user=request.user)
            return Response({'token': token.key})
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)



class CategoryListView(generics.ListCreateAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminUser]



class ProductListView(generics.ListCreateAPIView):
    serializer_class   = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = Product.objects.select_related('category').prefetch_related('reviews')
        category_id = self.request.query_params.get('category')
        discount    = self.request.query_params.get('discount')
        if category_id:
            qs = qs.filter(category_id=category_id)
        if discount == 'true':
            qs = qs.filter(discount__gt=0)
        return qs


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Product.objects.prefetch_related('reviews')
    serializer_class   = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]


class ReviewCreateView(generics.CreateAPIView):
    serializer_class   = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['pk'])
        serializer.save(
            product=product,
            user=self.request.user,
            author=self.request.user.username,
        )



class ProductImageListView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        images = ProductImage.objects.filter(product_id=pk)
        s = ProductImageSerializer(images, many=True, context={'request': request})
        return Response(s.data)

    def post(self, request, pk):
        product = Product.objects.get(pk=pk)
        if product.images.count() >= 7:
            return Response({'error': 'Максимум 7 зображень на товар'},
                            status=status.HTTP_400_BAD_REQUEST)
        s = ProductImageSerializer(data=request.data, context={'request': request})
        if s.is_valid():
            order = int(request.data.get('order', product.images.count()))
            s.save(product=product, order=order)
            return Response(s.data, status=status.HTTP_201_CREATED)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductImageDetailView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        img = ProductImage.objects.get(pk=pk)
        img.image.delete(save=False)  
        img.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
