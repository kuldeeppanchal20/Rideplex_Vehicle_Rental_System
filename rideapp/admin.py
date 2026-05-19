from django.contrib import admin
from .models import *
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter, landscape, legal
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle


# ---------------- ADMIN ---------------- #

class AdminDisplay(admin.ModelAdmin):
    list_display = ['name', 'email', 'password', 'contact']
    search_fields = ['name', 'email']
    list_filter = ['email']


# ---------------- DRIVER ---------------- #

class DriverAdmin(admin.ModelAdmin):
    list_display = ['dname', 'email', 'password', 'contact', 'gender', 'is_available', 'driverpfp']
    search_fields = ['dname', 'email']
    list_filter = ['gender', 'is_available']
    list_per_page = 10


# ---------------- LEASER ---------------- #

class LeasrAdmin(admin.ModelAdmin):
    list_display = ['lname', 'email', 'password', 'contact', 'age', 'leaserpfp']
    search_fields = ['lname', 'email']
    list_filter = ['age']
    list_per_page = 10


# ---------------- USER ---------------- #

class UserAdmin(admin.ModelAdmin):
    list_display = ['uname', 'email', 'password', 'contact', 'age', 'address', 'userpfp']
    search_fields = ['uname', 'email', 'contact']
    list_filter = ['age']
    list_per_page = 10


# ---------------- CATEGORY ---------------- #

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['catname', 'description']
    search_fields = ['catname']
    list_per_page = 10


# ---------------- SUBCATEGORY ---------------- #

class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['vcategory', 'subcatname', 'description']
    search_fields = ['subcatname']
    list_filter = ['vcategory']
    list_per_page = 10


# ---------------- VEHICLE ---------------- #

class VehicleAdmin(admin.ModelAdmin):
    # Table view columns
    list_display = [
        'brand',
        'model',
        'registration_number',
        'leaser_id',
        'rc_verified',
        'insurance_verified',
        'puc_verified',
        'available_status',
        'vehicleimg1',
        'vehicleimg2',
        'vehicleimg3',
        'vehicleimg4'
    ]

    search_fields = ['brand', 'model', 'registration_number']
    list_filter = ['vcategory', 'available_status', 'rc_verified', 'insurance_verified', 'puc_verified']
    list_per_page = 10

    # Detailed Edit Form layout
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'leaser_id', 'vcategory', 'vsubcategory', 'brand', 'model',
                'fuel_type', 'seats', 'fare', 'registration_number', 'available_status'
            )
        }),
        ('Vehicle Images', {
            'fields': (
                'vehicle_img', 'leftside_angle', 'rightside_angle', 'front_angle'
            )
        }),
        ('RC Book Details', {
            'fields': (
                'rc_book', 'rc_number', 'rc_issue_date', 'rc_expiry_date', 'rc_verified'
            ),
            'classes': ('collapse',),
        }),
        ('Insurance Details', {
            'fields': (
                'insurance', 'insurance_number', 'insurance_issue_date', 'insurance_expiry_date', 'insurance_verified'
            ),
            'classes': ('collapse',),
        }),
        ('PUC Details', {
            'fields': (
                'puc', 'puc_number', 'puc_issue_date', 'puc_expiry_date', 'puc_verified'
            ),
            'classes': ('collapse',),
        }),
    )



# ---------------- PDF EXPORT FUNCTION ---------------- #

from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import landscape, legal  # <-- FIX 1: Import 'legal'
from reportlab.lib import colors
from django.http import HttpResponse

def export_to_pdf(modeladmin, request, queryset):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="booking_report.pdf"'

    # FIX 2: Set pagesize to landscape(legal) for maximum horizontal space
    doc = SimpleDocTemplate(
        response,
        pagesize=landscape(legal),
        leftMargin=15,
        rightMargin=15,
        topMargin=20,
        bottomMargin=20
    )

    elements = []

    headers = [
        'ID', 'User', 'Driver', 'Leaser', 'Vehicle', 'Booking Type',
        'Pickup Loc', 'Pickup Time', 'Booking Date', 'Start Date',
        'End Date', 'Book Status', 'Ride Status', 'Driver Fee',
        'Deposit', 'Total Amt'
    ]

    # Initialize Paragraph style for the Pickup Loc column
    styles = getSampleStyleSheet()
    wrap_style = styles["Normal"]
    wrap_style.fontSize = 7
    wrap_style.alignment = 1        # Center alignment
    wrap_style.leading = 9          # Line spacing

    data = []

    for obj in queryset:
        # Wrap the long text in a Paragraph
        pickup_loc_text = obj.pickup_location if obj.pickup_location else "NA"
        pickup_loc_paragraph = Paragraph(pickup_loc_text, wrap_style)

        data.append([
            str(obj.id),
            obj.user_id.uname if obj.user_id else "NA",
            obj.driver_id.dname if obj.driver_id else "NA",
            obj.leaser_id.lname if obj.leaser_id else "NA",
            obj.vehicle_id.brand if obj.vehicle_id else "NA",
            obj.get_booking_type_display(),
            pickup_loc_paragraph,   # <--- Wrapped paragraph
            obj.pickup_time.strftime("%H:%M") if obj.pickup_time else "NA",
            obj.booking_date.strftime("%Y-%m-%d") if obj.booking_date else "NA",
            obj.start_date.strftime("%Y-%m-%d") if obj.start_date else "NA",
            obj.end_date.strftime("%Y-%m-%d") if obj.end_date else "NA",
            "Active" if obj.booking_status else "Inactive",
            obj.get_ride_status_display(),
            str(obj.total_driver_fee),
            str(obj.security_deposit),
            str(obj.total_amount)
        ])

    # FIX 3: Perfectly calibrated widths for 16 columns on Legal Landscape.
    # Total sum = 970 points (Legal page width is 1008 points).
    # NOTE: If you removed the 'ID' column from your code, remove the first `25` from this list!
    col_widths = [
        25,   # ID
        50,   # User
        50,   # Driver
        50,   # Leaser
        50,   # Vehicle
        65,   # Booking Type
        180,  # Pickup Loc (Given 180 points to comfortably wrap text)
        55,   # Pickup Time
        60,   # Booking Date
        60,   # Start Date
        60,   # End Date
        55,   # Book Status
        55,   # Ride Status
        50,   # Driver Fee
        50,   # Deposit
        55    # Total Amt
    ]

    table = Table([headers] + data, colWidths=col_widths)

    style = TableStyle([
        # Header Styling
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2C3E50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),

        # General Data Alignment & Font
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 7),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),

        # Alternating Row Colors
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),

        # Subtle Borders
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#2C3E50')),
        ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#E74C3C')),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.lightgrey),
    ])

    table.setStyle(style)
    elements.append(table)
    doc.build(elements)

    return response

export_to_pdf.short_description = "Export Selected Bookings to PDF"
# ---------------- BOOKING ---------------- #

class BookingAdmin(admin.ModelAdmin):

    list_display = [
        'user_id',
        'driver_id',
        'leaser_id',
        'vehicle_id',
        'booking_type',
        'pickup_location',
        'pickup_time',
        'booking_date',
        'start_date',
        'end_date',
        'booking_status',
        'total_driver_fee',
        'security_deposit',
        'total_amount',
        'ride_status'
    ]

    search_fields = [
        'user_id__uname',
        'driver_id__dname',
        'vehicle_id__brand'
    ]

    list_filter = [
        'booking_type',
        'booking_status',
        'booking_date',
        'ride_status'
    ]

    date_hierarchy = 'booking_date'
    actions = [export_to_pdf]


# ---------------- ASSIGN DRIVER ---------------- #

class AssignDriverAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'driver_id', 'status', 'date']
    search_fields = ['driver_id__dname', 'booking_id__id']
    list_filter = ['status', 'date']


# ---------------- VEHICLE RETURN ---------------- #

class VehicleReturnAdmin(admin.ModelAdmin):
    list_display = [
        'vehicle_id',
        'leaser_id',
        'booking_id',
        'request_message',
        'status',
        'created_at'
    ]
    list_filter = ['created_at']
    search_fields = ['vehicle_id__brand', 'leaser_id__lname']


# ---------------- DOCUMENTS ---------------- #

@admin.display(empty_value="NA")
class DocumentAdmin(admin.ModelAdmin):

    list_display = [
        'driver_id',
        'user_id',
        'leaser_id',
        'document_type',
        'document_number',
        'issue_date',
        'expiry_date',
        'verification_status',
        'documentimg'
    ]

    list_filter = [
        'document_type',
        'verification_status'
    ]

    search_fields = [
        'document_number',
        'user_id__uname',
        'driver_id__dname'
    ]


# ---------------- PAYMENT ---------------- #

class PaymentAdmin(admin.ModelAdmin):

    list_display = [
        'user_id',
        'booking_id',
        'amount',
        'payment_type',
        'transaction_date',
        'transaction_status',
        'razorpay_id'
    ]

    list_filter = [
        'payment_type',
        'transaction_status'
    ]

    search_fields = ['razorpay_id']


# ---------------- FEEDBACK ---------------- #

@admin.display(empty_value="NA")
class FeedbackAdmin(admin.ModelAdmin):

    list_display = [
        'user_id',
        'driver_id',
        'leaser_id',
        'rating',
        'comment',
        'date'
    ]

    list_filter = ['rating', 'date']
    search_fields = ['user_id__uname', 'driver_id__dname']


# ---------------- COMPLAINT ---------------- #

@admin.display(empty_value="NA")
class ComplaintAdmin(admin.ModelAdmin):

    list_display = [
        'user_id',
        'driver_id',
        'leaser_id',
        'title',
        'description',
        'date'
    ]

    list_filter = ['date']
    search_fields = ['title', 'user_id__uname']


# ---------------- REGISTER MODELS ---------------- #

admin.site.register(Admin, AdminDisplay)
admin.site.register(Driver, DriverAdmin)
admin.site.register(Leaser, LeasrAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Vehicle_category, CategoryAdmin)
admin.site.register(Vehicle_subcategory, SubCategoryAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Assign_Driver, AssignDriverAdmin)
admin.site.register(VehicleReturnRequest, VehicleReturnAdmin)
admin.site.register(Documents, DocumentAdmin)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Complaint, ComplaintAdmin)