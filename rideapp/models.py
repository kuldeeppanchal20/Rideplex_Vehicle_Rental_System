from django.db import models
from django.utils.regex_helper import Choice
from django.utils.safestring import mark_safe
from django.core.validators import MinLengthValidator, MinValueValidator, MaxLengthValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.timezone import now


# ---------------- ADMIN ---------------- #

class Admin(models.Model):
    name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    contact =  models.BigIntegerField(validators=[MinValueValidator(1000000000), MaxValueValidator(9999999999)])

    def __str__(self):
        return self.name


# ---------------- DRIVER ---------------- #

gender_choices = [
    ('Male', 'Male'),
    ('Female', 'Female'),
]


class Driver(models.Model):
    dname = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    contact = models.BigIntegerField(validators=[MinValueValidator(1000000000), MaxValueValidator(9999999999)])

    gender = models.CharField(max_length=10, choices=gender_choices)
    is_available = models.BooleanField(default=True)
    profile_pic = models.ImageField(upload_to="photos/driver_pfp", null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.dname}"

    def driverpfp(self):
        if self.profile_pic:
            return mark_safe(f'<img src="{self.profile_pic.url}" width="100"/>')
        return "No Image"


# ---------------- LEASER ---------------- #

class Leaser(models.Model):
    lname = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    contact = models.BigIntegerField(validators=[MinValueValidator(1000000000), MaxValueValidator(9999999999)])

    age = models.PositiveIntegerField(validators=[MinValueValidator(18)])
    profile_pic = models.ImageField(upload_to="photos/leaser_pfp", null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.lname}"

    def leaserpfp(self):
        if self.profile_pic:
            return mark_safe(f'<img src="{self.profile_pic.url}" width="100"/>')
        return "No Image"


# ---------------- USER ---------------- #

class User(models.Model):
    uname = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    contact = models.BigIntegerField(validators=[MinValueValidator(1000000000), MaxValueValidator(9999999999)])

    age = models.PositiveIntegerField(validators=[MinValueValidator(18)])
    address = models.TextField()
    profile_pic = models.ImageField(upload_to="photos/user_pfp", null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.uname}"

    def userpfp(self):
        if self.profile_pic:
            return mark_safe(f'<img src="{self.profile_pic.url}" width="100"/>')
        return "No Image"


# ---------------- CATEGORY ---------------- #

class Vehicle_category(models.Model):
    catname = models.CharField(max_length=30)
    description = models.TextField()

    def __str__(self):
        return self.catname


class Vehicle_subcategory(models.Model):
    vcategory = models.ForeignKey(Vehicle_category, on_delete=models.CASCADE)
    subcatname = models.CharField(max_length=30)
    description = models.TextField()

    def __str__(self):
        return self.subcatname


# ---------------- VEHICLE ---------------- #
vehicle_status = [
    ('1', 'Available'),
    ('2', 'Not Available'),
    ('3', 'On Ride'),
]


class Vehicle(models.Model):
    leaser_id = models.ForeignKey(Leaser, on_delete=models.CASCADE)
    vcategory = models.ForeignKey(Vehicle_category, on_delete=models.CASCADE)
    vsubcategory = models.ForeignKey(Vehicle_subcategory, on_delete=models.CASCADE)

    brand = models.CharField(max_length=30)
    model = models.CharField(max_length=30)
    fuel_type = models.CharField(max_length=30, null=True)
    seats = models.CharField(max_length=30, null=True)

    vehicle_img = models.ImageField(upload_to="photos/vehicle_images")
    leftside_angle = models.ImageField(upload_to="photos/vehicle_images", null=True)
    rightside_angle = models.ImageField(upload_to="photos/vehicle_images", null=True)
    front_angle = models.ImageField(upload_to="photos/vehicle_images", null=True)

    fare = models.IntegerField(validators=[MinValueValidator(1)])
    registration_number = models.CharField(max_length=30, unique=True)
    available_status = models.CharField(max_length=30, null=True, choices=vehicle_status)

    # --- VEHICLE SPECIFIC DOCUMENTS W/ DETAILS ---

    # RC BOOK
    rc_book = models.FileField(upload_to="photos/vehicle_documents", null=True, blank=True)
    rc_number = models.CharField(max_length=50, null=True, blank=True)
    rc_issue_date = models.DateField(null=True, blank=True)
    rc_expiry_date = models.DateField(null=True, blank=True)
    rc_verified = models.BooleanField(default=False)

    # INSURANCE
    insurance = models.FileField(upload_to="photos/vehicle_documents", null=True, blank=True)
    insurance_number = models.CharField(max_length=50, null=True, blank=True)
    insurance_issue_date = models.DateField(null=True, blank=True)
    insurance_expiry_date = models.DateField(null=True, blank=True)
    insurance_verified = models.BooleanField(default=False)

    # PUC
    puc = models.FileField(upload_to="photos/vehicle_documents", null=True, blank=True)
    puc_number = models.CharField(max_length=50, null=True, blank=True)
    puc_issue_date = models.DateField(null=True, blank=True)
    puc_expiry_date = models.DateField(null=True, blank=True)
    puc_verified = models.BooleanField(default=False)


    def clean(self):
        if self.rc_issue_date and self.rc_expiry_date and self.rc_expiry_date <= self.rc_issue_date:
            raise ValidationError("RC Expiry date must be strictly after the issue date.")
        if self.insurance_issue_date and self.insurance_expiry_date and self.insurance_expiry_date <= self.insurance_issue_date:
            raise ValidationError("Insurance Expiry date must be strictly after the issue date.")
        if self.puc_issue_date and self.puc_expiry_date and self.puc_expiry_date <= self.puc_issue_date:
            raise ValidationError("PUC Expiry date must be strictly after the issue date.")

    def __str__(self):
        return f"{self.brand} {self.model}"

    def vehicleimg1(self):
        if self.vehicle_img:
            return mark_safe(f'<img src="{self.vehicle_img.url}" width="100"/>')
        return ""

    def vehicleimg2(self):
        if self.leftside_angle:
            return mark_safe(f'<img src="{self.leftside_angle.url}" width="100"/>')
        return ""

    def vehicleimg3(self):
        if self.rightside_angle:
            return mark_safe(f'<img src="{self.rightside_angle.url}" width="100"/>')
        return ""

    def vehicleimg4(self):
        if self.front_angle:
            return mark_safe(f'<img src="{self.front_angle.url}" width="100"/>')
        return ""


# ---------------- BOOKING ---------------- #

booking_choices = [
    ('with_driver', 'With driver'),
    ('self_drive', 'Self drive'),
]

ride_status_choices = [
    ('not_started', 'Not Started'),
    ('on_ride', 'On Ride'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]


class Booking(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    leaser_id = models.ForeignKey(Leaser, on_delete=models.CASCADE)
    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.CASCADE)

    booking_type = models.CharField(max_length=30, choices=booking_choices)
    pickup_location = models.TextField( null=True, blank=True)
    pickup_time = models.TimeField(null=True, blank=True)

    booking_date = models.DateField(auto_now=True)

    start_date = models.DateField()
    end_date = models.DateField()

    booking_status = models.BooleanField(default=True)

    # ✅ NEW FIELD
    ride_status = models.CharField(
        max_length=20,
        choices=ride_status_choices,
        default='not_started'
    )
    total_driver_fee = models.FloatField(default=0)
    total_amount = models.FloatField(default=0)
    security_deposit = models.FloatField(default=0)

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError("Start date cannot be after end date.")

    def __str__(self):
        return f"Booking {self.id} - {self.ride_status}"


# ---------------- ASSIGN DRIVER ---------------- #

class Assign_Driver(models.Model):
    booking_id = models.ForeignKey(Booking, on_delete=models.CASCADE)
    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE)
    status = models.BooleanField(default=True)
    date = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.driver_id} - {'Active' if self.status else 'Inactive'}"


# ---------------- VEHICLE RETURN ---------------- #


class VehicleReturnRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    vehicle_id = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    leaser_id = models.ForeignKey(Leaser, on_delete=models.CASCADE)

    # Optional (only if vehicle is on ride)
    booking_id = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)

    request_message = models.TextField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_id} - {self.status}"


# ---------------- DOCUMENTS ---------------- #

class Documents(models.Model):
    DOC_CHOICES = [
        ('1', 'Aadhar Card'),
        ('2', 'Driving License'),
        ('6', 'PAN Card')
    ]

    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    leaser_id = models.ForeignKey(Leaser, on_delete=models.CASCADE, null=True, blank=True)

    document_type = models.CharField(max_length=30, choices=DOC_CHOICES)

    document_number = models.CharField(max_length=50, null=True, blank=True)

    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)

    doc_file = models.ImageField(upload_to="photos/document_images", null=True, blank=True)

    verification_status = models.BooleanField(default=False)

    def clean(self):
        if self.expiry_date and self.expiry_date < timezone.now().date():
            raise ValidationError("Document has expired.")

    def documentimg(self):
        if self.doc_file:
            return mark_safe(f'<img src="{self.doc_file.url}" width="100"/>')
        return ""

    class Meta:
        unique_together = [
            ('user_id', 'document_type'),
            ('driver_id', 'document_type'),
            ('leaser_id', 'document_type'),
        ]


# ---------------- PAYMENT ---------------- #

class Payment(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_id = models.ForeignKey(Booking, on_delete=models.CASCADE)

    amount = models.FloatField(validators=[MinValueValidator(1)])

    payment_type = models.CharField(max_length=30)

    transaction_date = models.DateField(auto_now=True)

    transaction_status = models.BooleanField(default=True)

    razorpay_id = models.CharField(max_length=200, null=True, blank=True)


# ---------------- FEEDBACK ---------------- #

class Feedback(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    leaser_id = models.ForeignKey(Leaser, on_delete=models.CASCADE, null=True, blank=True)

    rating = models.FloatField(validators=[MinValueValidator(1)])

    comment = models.TextField()

    date = models.DateField(auto_now=True)


# ---------------- COMPLAINT ---------------- #

class Complaint(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    leaser_id = models.ForeignKey(Leaser, on_delete=models.CASCADE, null=True, blank=True)

    title = models.CharField(max_length=15)

    description = models.TextField()

    date = models.DateField(auto_now=True)