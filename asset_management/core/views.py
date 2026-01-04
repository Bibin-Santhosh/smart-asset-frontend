from django.contrib.auth import get_user_model
from django.db.models import F
from django.utils.timezone import now

from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import check_password

from .models import Asset, InventoryItem, Assignment, RepairTicket
from .serializers import (
    AssetSerializer,
    InventorySerializer,
    AssignmentSerializer,
    RepairTicketSerializer,
)

User = get_user_model()  # ✅ CORRECT USER MODEL


# =======================
# VIEWSETS
# =======================

class AssetViewSet(ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]


class InventoryViewSet(ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]


class AssignmentViewSet(ModelViewSet):
    queryset = Assignment.objects.select_related("asset", "employee")
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        assignment = serializer.save(status="ACTIVE")
        asset = assignment.asset
        asset.status = "ASSIGNED"
        asset.save()

    def perform_update(self, serializer):
        assignment = serializer.save()
        if assignment.status == "RETURNED" and assignment.date_returned is None:
            assignment.date_returned = now()
            assignment.save()

            asset = assignment.asset
            asset.status = "AVAILABLE"
            asset.save()


class RepairTicketViewSet(ModelViewSet):
    queryset = RepairTicket.objects.all().order_by("-opened_on")
    serializer_class = RepairTicketSerializer
    permission_classes = [IsAuthenticated]


# =======================
# PROFILE
# =======================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "role": user.role,  # ✅ USE CUSTOM FIELD
    })


# =======================
# DASHBOARD
# =======================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    return Response({
        "total_assets": Asset.objects.count(),
        "total_inventory": InventoryItem.objects.count(),
        "assigned_assets": Assignment.objects.filter(
            date_returned__isnull=True
        ).count(),
        "low_stock": InventoryItem.objects.filter(
            quantity__lte=F("threshold")
        ).count(),
        "open_tickets": RepairTicket.objects.exclude(status="CLOSED").count(),
        "tickets_status": {
            "OPEN": RepairTicket.objects.filter(status="OPEN").count(),
            "IN_PROGRESS": RepairTicket.objects.filter(status="IN_PROGRESS").count(),
            "CLOSED": RepairTicket.objects.filter(status="CLOSED").count(),
        },
        "assets_status": {
            "AVAILABLE": Asset.objects.filter(status="AVAILABLE").count(),
            "ASSIGNED": Asset.objects.filter(status="ASSIGNED").count(),
            "UNDER_REPAIR": Asset.objects.filter(status="UNDER_REPAIR").count(),
        },
    })


# =======================
# RECENT ACTIVITY
# =======================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    tickets = RepairTicket.objects.select_related("asset").order_by("-id")[:5]

    return Response([
        {
            "message": f"Ticket for {t.asset.name} marked {t.status}",
            "time": t.opened_on,
        }
        for t in tickets
    ])


# =======================
# USERS LIST
# =======================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = User.objects.all().order_by("username")

    return Response([
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
        }
        for u in users
    ])


# =======================
# CHANGE PASSWORD
# =======================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    if not check_password(
        request.data.get("current_password"),
        user.password
    ):
        return Response(
            {"error": "Current password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(request.data.get("new_password"))
    user.save()

    return Response(
        {"success": "Password changed successfully"},
        status=status.HTTP_200_OK
    )
@api_view(["POST"])
def login_view(request):
    from django.contrib.auth import authenticate
    from rest_framework_simplejwt.tokens import RefreshToken
    from rest_framework.response import Response
    from rest_framework import status

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user.role,
        "username": user.username,
    })


from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenSerializer

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Assignment, RepairTicket


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_dashboard(request):
    user = request.user

    # Get only ACTIVE assignments
    assignments = Assignment.objects.filter(
        employee=user,
        status="ACTIVE"
    ).select_related("asset")

    assigned_assets = []
    for a in assignments:
        if not a.asset:
            continue

        assigned_assets.append({
            "asset_name": a.asset.name,
            # ✅ FIXED FIELD NAME
            "assigned_at": a.date_assigned,
        })

    active_tickets = RepairTicket.objects.filter(
        reported_by=user,
        status__in=["OPEN", "IN_PROGRESS"]
    )

    resolved_tickets = RepairTicket.objects.filter(
        reported_by=user,
        status="CLOSED"
    )

    return Response({
        "stats": {
            "my_assets": assignments.count(),
            "active_tickets": active_tickets.count(),
            "resolved_tickets": resolved_tickets.count(),
        },
        "assigned_assets": assigned_assets
    })
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Assignment


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_assets(request):
    user = request.user

    assignments = Assignment.objects.filter(
        employee=user,
        status="ACTIVE"
    ).select_related("asset")

    return Response([
        {
            "id": a.asset.id,
            "name": a.asset.name
        }
        for a in assignments
        if a.asset
    ])


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import RepairTicket


@api_view(["POST"])   # ✅ POST ONLY
@permission_classes([IsAuthenticated])
def report_issue(request):
    asset_id = request.data.get("asset")
    issue = request.data.get("issue")

    if not asset_id or not issue:
        return Response(
            {"error": "Asset and issue are required"},
            status=400
        )

    RepairTicket.objects.create(
        asset_id=asset_id,
        issue=issue,
        reported_by=request.user,
        status="OPEN"
    )

    return Response(
        {"message": "Issue reported successfully"},
        status=201
    )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Assignment


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_assignments(request):
    assignments = Assignment.objects.filter(
        employee=request.user
    ).select_related("asset")

    data = []
    for a in assignments:
        if not a.asset:
            continue

        data.append({
            "id": a.id,
            "asset": a.asset.name,
            "status": a.status,
            "assigned_date": a.date_assigned,
        })

    return Response(data)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import RepairTicket


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_tickets(request):
    tickets = RepairTicket.objects.filter(
        reported_by=request.user
    ).select_related("asset", "technician")

    data = []
    for ticket in tickets:
        data.append({
            "id": ticket.id,
            "asset": ticket.asset.name if ticket.asset else "N/A",
            "issue": ticket.issue,
            "status": ticket.status,
            "technician": (
                ticket.technician.username
                if ticket.technician is not None
                else "Not assigned"
            ),
            "opened_on": ticket.opened_on,
            "assigned_on": ticket.assigned_on,
            "resolved_on": ticket.resolved_on,
        })

    return Response(data)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timesince import timesince
from .models import RepairTicket


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def technician_dashboard(request):
    user = request.user  # ✅ User object (NOT username)

    tickets = RepairTicket.objects.filter(
        technician=user
    ).select_related("asset").order_by("-opened_on")

    open_count = tickets.filter(status="OPEN").count()
    in_progress_count = tickets.filter(status="IN_PROGRESS").count()
    closed_count = tickets.filter(status="CLOSED").count()

    ticket_list = []
    activity = []

    for t in tickets:
        ticket_list.append({
            "id": t.id,
            "asset": t.asset.name if t.asset else "",
            "issue": t.issue,
            "status": t.status,
            "opened_on": t.opened_on,
        })

        activity.append({
            "message": f"{t.asset.name} – {t.status}",
            "time": f"{timesince(t.opened_on)} ago"
        })

    return Response({
        "stats": {
            "open": open_count,
            "in_progress": in_progress_count,
            "closed": closed_count,
        },
        "tickets": ticket_list,
        "activity": activity,
    })

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import RepairTicket, ActivityLog


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_ticket_status(request, ticket_id):
    ticket = get_object_or_404(
        RepairTicket,
        id=ticket_id,
        technician=request.user
    )

    status = request.data.get("status")

    if status not in ["OPEN", "IN_PROGRESS", "CLOSED"]:
        return Response({"error": "Invalid status"}, status=400)

    ticket.status = status

    if status == "IN_PROGRESS":
        ticket.assigned_on = timezone.now()
    elif status == "CLOSED":
        ticket.resolved_on = timezone.now()

    ticket.save()

    # ✅ Activity log (SAFE)
    ActivityLog.objects.create(
        user=request.user,
        message=f"Ticket for {ticket.asset.name} marked {status}"
    )

    return Response({"message": "Status updated successfully"})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def technician_recent_activity(request):
    activities = ActivityLog.objects.filter(
        user=request.user
    )[:10]

    return Response([
        {
            "message": activity.message,
            "time": activity.created_at
        }
        for activity in activities
    ])
