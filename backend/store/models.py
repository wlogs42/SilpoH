from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user   = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return f'Profile({self.user.username})'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()


class Category(models.Model):
    """
    Категорія товарів (М'ясо, Фрукти тощо).
    Зберігається в таблиці store_category.
    """
    name    = models.CharField(max_length=200)
    icon    = models.CharField(max_length=10, default='📦')
    theme   = models.CharField(max_length=7,  default='#f5f5f5')
    is_new  = models.BooleanField(default=False)
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Категорія'
        verbose_name_plural = 'Категорії'

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    Товар. ForeignKey на Category → в БД колонка category_id.
    on_delete=CASCADE → видалення категорії видаляє всі її товари.
    related_name='products' → category.products.all()
    """
    category    = models.ForeignKey(Category, on_delete=models.CASCADE,
                                    related_name='products')
    name        = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    old_price   = models.DecimalField(max_digits=10, decimal_places=2,
                                      null=True, blank=True)
    discount    = models.PositiveIntegerField(default=0)
    image       = models.ImageField(upload_to='products/', null=True, blank=True)
    emoji       = models.CharField(max_length=10, default='📦')
    bg          = models.CharField(max_length=7,  default='#f5f5f5')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товари'

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image   = models.ImageField(upload_to='products/')
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'Image #{self.pk} → {self.product.name}'


class Review(models.Model):
    """
    Відгук. Прив'язаний до товару і (необов'язково) до юзера.
    """
    product    = models.ForeignKey(Product, on_delete=models.CASCADE,
                                   related_name='reviews')
    user       = models.ForeignKey(User, on_delete=models.SET_NULL,
                                   null=True, blank=True)
    author     = models.CharField(max_length=100)
    rating     = models.PositiveSmallIntegerField(default=5)
    text       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Відгук'
        verbose_name_plural = 'Відгуки'

    def __str__(self):
        return f'{self.author} → {self.product.name} ({self.rating}★)'
