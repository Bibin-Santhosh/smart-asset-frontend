from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from .models import Asset, InventoryItem, Assignment, RepairTicket

User = get_user_model()  # ✅ CORRECT USER MODEL


# =====================
# ASSET SERIALIZER
# =====================
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"


# =====================
# INVENTORY SERIALIZER
# =====================
class InventorySerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = [
            "id",
            "item_type",
            "quantity",
            "threshold",
            "status",
        ]

    def get_status(self, obj):
        if obj.quantity <= obj.threshold:
            return "LOW_STOCK"
        return "OK"


# =====================
# ASSIGNMENT SERIALIZER
# =====================
class AssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name", read_only=True)
    employee_name = serializers.CharField(source="employee.username", read_only=True)

    class Meta:
        model = Assignment
        fields = [
            "id",
            "asset",
            "asset_name",
            "employee",
            "employee_name",
            "status",
            "date_assigned",
            "date_returned",
        ]


# =====================
# REPAIR TICKET SERIALIZER
# =====================
class RepairTicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name", read_only=True)

    class Meta:
        model = RepairTicket
        fields = "__all__"


# =====================
# USER LIST SERIALIZER
# =====================
class UserListSerializer(serializers.ModelSerializer):
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ USE ROLE FIELD (NOT GROUPS)
        token["role"] = user.role.capitalize()

        return token

from rest_framework import serializers
from .models import Assignment


class AssignedAssetSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source="asset.name")

    class Meta:
        model = Assignment
        fields = ["asset_name", "assigned_at"]
