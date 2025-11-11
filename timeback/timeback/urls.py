
from django.contrib import admin
from django.urls import path
from timeapp import views, viewsForm

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.schedule_view, name='schedule'),
    path('service/', viewsForm.checkService, name='scheduleForm'),
]
