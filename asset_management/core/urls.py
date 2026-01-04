from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    profile_view,
    change_password,
    dashboard_stats,
    recent_activity,
    CustomTokenView,
    login_view,
    employee_dashboard,
    employee_assets,
    report_issue,
    users_list,
    employee_assignments,
    employee_tickets,
    technician_dashboard,
    update_ticket_status,
    technician_recent_activity,
    AssetViewSet,
    InventoryViewSet,
    AssignmentViewSet,
    RepairTicketViewSet,
)

router = DefaultRouter()
router.register("assets", AssetViewSet)
router.register("inventory", InventoryViewSet)
router.register("assignments", AssignmentViewSet)
router.register("tickets", RepairTicketViewSet)

urlpatterns = [
    # ---------- AUTH & COMMON ----------
    path("api/token/", CustomTokenView.as_view(), name="token"),
    path("api/login/", login_view),
    path("api/profile/", profile_view),
    path("api/change-password/", change_password),
    path("api/users/", users_list),

    # ---------- DASHBOARD ----------
    path("api/dashboard/", dashboard_stats),
    path("api/recent-activity/", recent_activity),

    # ---------- EMPLOYEE ----------
    path("api/employee/dashboard/", employee_dashboard),
    path("api/employee/assets/", employee_assets),

    # ✅ MUST COME BEFORE router.urls
    path("api/tickets/report/", report_issue),

    path("api/employee/assignments/", employee_assignments),

    path("api/employee/tickets/", employee_tickets),
    path("api/technician/dashboard/", technician_dashboard),

   path(
    "api/technician/tickets/<int:ticket_id>/status/",
    update_ticket_status,
),
path("api/technician/recent-activity/", technician_recent_activity),



    # ---------- ROUTER (LAST) ----------
    path("api/", include(router.urls),),
]
