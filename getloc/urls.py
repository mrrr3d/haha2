from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('reload_log_data/', views.reload_log_data, name='reload_log_data'),
]
