"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from medical_devices import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^get_device_info/$', views.get_device_info, name='get_device_info'),
    re_path(r'^get_eudamed_data/$', views.get_eudamed_data, name='get_eudamed_data'),
    re_path(r'^get_fda_data/$', views.get_fda_data, name='get_fda_data'),
]
