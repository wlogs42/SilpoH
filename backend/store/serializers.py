from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Product, ProductImage, Review, UserProfile


class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'avatar_url']
        read_only_fields = ['email']

    def get_avatar_url(self, obj):
        request = self.context.get('request')
        try:
            profile = obj.profile
            if profile.avatar and request:
                return request.build_absolute_uri(profile.avatar.url)
        except UserProfile.DoesNotExist:
            pass
        return None

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance


class ChangeEmailSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['password']):
            raise serializers.ValidationError({'password': 'Невірний пароль'})
        if User.objects.filter(email__iexact=data['email']).exclude(pk=user.pk).exists():
            raise serializers.ValidationError({'email': 'Ця пошта вже використовується'})
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Невірний поточний пароль')
        return value


class RegisterSerializer(serializers.ModelSerializer):
    """
    Серіалізатор реєстрації.
    write_only=True — пароль не повертається у відповіді.
    """
    password  = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Паролі не співпадають'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = ProductImage
        fields = ['id', 'image', 'image_url', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Review
        fields = ['id', 'author', 'rating', 'text', 'created_at']
        read_only_fields = ['created_at']


class ProductSerializer(serializers.ModelSerializer):
    reviews       = ReviewSerializer(many=True, read_only=True)
    reviews_count = serializers.IntegerField(source='reviews.count', read_only=True)
    images        = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model  = Product
        fields = [
            'id', 'category', 'name', 'description',
            'price', 'old_price', 'discount',
            'emoji', 'bg', 'images',
            'reviews', 'reviews_count', 'created_at',
        ]
        read_only_fields = ['created_at']


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model  = Category
        fields = ['id', 'name', 'icon', 'theme', 'is_new', 'order', 'products_count']
