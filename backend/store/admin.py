from django.contrib import admin
from .models import Category, Product, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    list_display    — які колонки показувати в таблиці
    list_editable   — редагувати прямо в таблиці (без відкриття)
    search_fields   — пошук по полях
    """
    list_display  = ['name', 'icon', 'theme', 'is_new', 'order']
    list_editable = ['icon', 'theme', 'is_new', 'order']
    search_fields = ['name']


class ReviewInline(admin.TabularInline):
    """
    Inline — відгуки показуються ВСЕРЕДИНІ картки товару.
    extra=1 — одне порожнє поле для нового відгуку.
    """
    model  = Review
    extra  = 1
    fields = ['author', 'rating', 'text']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['name', 'category', 'price', 'old_price', 'discount', 'created_at']
    list_filter    = ['category']          
    search_fields  = ['name', 'description']
    list_editable  = ['price', 'discount']
    inlines        = [ReviewInline]       
    readonly_fields = ['created_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author', 'product', 'rating', 'created_at']
    list_filter  = ['rating']
