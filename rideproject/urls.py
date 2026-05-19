"""
URL configuration for rideproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.urls import path

from django.conf.urls.static import static
from django.conf import settings
from rideapp import views
urlpatterns = [
path('admin/', admin.site.urls),
    path("",views.home),
    path("userregister",views.userregister),
    path("userregisterdata",views.userregisterdata),
    path("leaserregister",views.leaserregister),
    path("leaserregisterdata",views.leaserregisterdata),
    path("registration",views.registration),
    path("login",views.login),
    path("logindata",views.logindata),
    path("logout", views.logout),


    path("bikes",views.bikes),

    path("bookinghistory",views.book),
    path('bookingdetails/<int:id>/', views.booking_details, name='booking_details'),
    path('cancel-booking/<int:id>',views.cancel_booking,name='cancel_booking'),
    path('download-booking/<int:id>/', views.download_booking_pdf),




    path("vehicle",views.vehicle),
    path("singlecar/<int:id>",views.singlecar),

    path("booking/<int:id>",views.booking),
    path("confirm_booking/<int:id>",views.confirm_booking),


    path("practice/<int:id>",views.practice),
    path('reciept', views.reciept),
    path('about',views.about),
    path('support',views.contact),

                  path('payment', views.payment, name='payment'),

                  # Process payment (form submit)
                  path('paymentprocess', views.paymentprocess, name='paymentprocess'),

                  # ✅ After Razorpay success
                  path('payment-success', views.payment_success, name='payment_success'),

                  path('driverprofile',views.driverprofile),
    path('changedriverprofile',views.changedriverprofile),

    path('userprofile',views.userprofile),
    path('changeuserprofile',views.changeuserprofile),



    path('manage_documents', views.manage_documents),
path('delete_document/<int:id>', views.delete_document),
    path("document", views.manage_documents),


    path('leaserprofile',views.leaserprofile),
    path('changeleaserprofile',views.changeleaserprofile),

    path("leaser_add_car",views.leaser_add_car),
    path("editvehicle/<int:id>",views.editvehicle),
    path("updatevehicle",views.updatevehicle),
    path("deletevehicle/<int:id>",views.deletevehicle),

    path("leaser_cars",views.leaser_cars,name='leaser_cars'),
    path('vehicle-return-request', views.request_vehicle_return, name='request_vehicle_return'),
    path("leaser_bookings",views.leaser_bookings),

    path("assign_ride",views.assign_ride),
    path('update-ride-status/<int:id>/', views.update_ride_status, name='update_ride_status'),
    path('delete-assignment/<int:id>/', views.delete_assignment, name='delete_assignment'),

    path("feedback", views.feedback_view, name="feedback"),
    path("complaint", views.complaint_view, name="complaint"),

    path('otpverification', views.otp_verification),
    path('verifying-otp', views.verify_otp),
    path('forgot_password', views.forgotpasswordpage),
    path('forgotpassword', views.forgotpassword, name='forgotpassword'),
    path('reset_password', views.reset_password),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)