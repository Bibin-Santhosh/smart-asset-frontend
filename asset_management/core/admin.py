from django.contrib import admin
from .models import Asset, InventoryItem, Assignment, RepairTicket,User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'serial_number', 'status')
    list_filter = ('status', 'type')
    search_fields = ('name', 'serial_number')


@admin.register(InventoryItem)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('item_type', 'quantity', 'threshold')


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('asset', 'employee', 'date_assigned', 'date_returned')
    list_filter = ('date_assigned',)

@admin.register(RepairTicket)
class RepairAdmin(admin.ModelAdmin):
    list_display = (
        "asset",
        "status",
        "technician",
        "opened_on",   # ✅ exists
        "resolved_on",
    )


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Role", {"fields": ("role",)}),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    list_display = ("username", "email", "role", "is_staff", "is_superuser")
    list_filter = ("role", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    ordering = ("username",)
