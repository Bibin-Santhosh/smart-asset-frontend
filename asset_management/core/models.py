from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("EMPLOYEE", "Employee"),
        ("TECHNICIAN", "Technician"),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="EMPLOYEE"
    )

class Asset(models.Model):

    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("UNDER_REPAIR", "Under Repair"),
        ("ASSIGNED", "Assigned"),
    ]

    ASSET_TYPES = [
        ("LAPTOP", "Laptop"),
        ("KEYBOARD", "Keyboard"),
        ("MOUSE", "Mouse"),
        ("MONITOR", "Monitor"),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=ASSET_TYPES)
    serial_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    purchase_date = models.DateField()

    def __str__(self):
        return self.name



class InventoryItem(models.Model):
    item_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    threshold = models.PositiveIntegerField()

    def __str__(self):
        return self.item_type


class Assignment(models.Model):

    STATUS_CHOICES = (
        ("ACTIVE", "Active"),
        ("RETURNED", "Returned"),
    )

    asset = models.ForeignKey(
        Asset,
        on_delete=models.CASCADE,
        related_name="assignments"
    )
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assignments"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    date_assigned = models.DateTimeField(auto_now_add=True)
    date_returned = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.asset.name} → {self.employee.username}"



class RepairTicket(models.Model):
    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("IN_PROGRESS", "In Progress"),
        ("CLOSED", "Closed"),
    ]

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reported_tickets"
    )

    technician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tickets"
    )

    issue = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="OPEN")

    opened_on = models.DateTimeField(auto_now_add=True)
    assigned_on = models.DateTimeField(null=True, blank=True)
    resolved_on = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.asset.name} - {self.status}"


class ActivityLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activities"
    )
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.message
