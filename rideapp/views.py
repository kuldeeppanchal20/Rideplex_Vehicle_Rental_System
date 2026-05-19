import random
import json
import razorpay
from django.core.mail import send_mail
from django.db.models import Sum, Avg
from django.http import HttpResponse, JsonResponse
from django.template.loader import get_template
from django.utils.dateparse import parse_date
from django.shortcuts import render, redirect, get_object_or_404


from xhtml2pdf import pisa
from datetime import datetime, date, timedelta

from django.db.models import Sum

from rideproject import settings
from .models import *
from pyexpat.errors import messages
from django.contrib import messages


# Create your views here.
def home(request):
    cars = Vehicle.objects.filter(vcategory__catname__iexact="CAR")[:2]
    suvs = Vehicle.objects.filter(vcategory__catname__iexact="SUV")[:2]
    vans = Vehicle.objects.filter(vcategory__catname__iexact="VAN")[:2]

    # Combine all into one list
    vehicles = list(cars) + list(suvs) + list(vans)

    context = {'vehicles': vehicles}
    return render(request, 'home.html', context)


def login(request):
    return render(request, 'login.html')


def registration(request):
    return render(request, 'registration.html')


def userregister(request):
    return render(request, 'userregister.html')


def userregisterdata(request):
    if request.method == "POST":
        uname = request.POST.get('name')
        uemail = request.POST.get('email')
        upassword = request.POST.get('password')
        contact = request.POST.get('contact')
        age = request.POST.get('age')
        address = request.POST.get('address')
        pfp = request.FILES.get("pfp")

        if User.objects.filter(email=uemail).exists() or \
                Driver.objects.filter(email=uemail).exists() or \
                Leaser.objects.filter(email=uemail).exists():
            messages.error(request, "Email already exists! Please use another email.")
            return render(request, "userregister.html")

        User.objects.create(
            uname=uname,
            email=uemail,
            password=upassword,
            contact=contact,
            age=age,
            address=address,
            profile_pic=pfp
        )

        messages.success(request, "Registration Successful ✅")
        return redirect("/login")

    return render(request, "userregister.html")


def leaserregister(request):
    return render(request, 'leaserregister.html')


def leaserregisterdata(request):
    if request.method == "POST":
        lname = request.POST.get('name')
        lemail = request.POST.get('email')
        lpassword = request.POST.get('password')
        lcontact = request.POST.get('contact')
        age = request.POST.get('age')
        pfp = request.FILES.get("pfp")

        if User.objects.filter(email=lemail).exists() or \
                Driver.objects.filter(email=lemail).exists() or \
                Leaser.objects.filter(email=lemail).exists():
            messages.error(request, "Email already exists! Please use another email.")
            return render(request, "Leaserregister.html")

        insertquery = Leaser(
            lname=lname,
            email=lemail,
            password=lpassword,
            contact=lcontact,
            age=age,
            profile_pic=pfp
        )
        insertquery.save()

        messages.success(request, "Registration Successful ✅")
        return redirect("/login")

    return render(request, "Leaserregister.html")


def logindata(request):
    useremail = request.POST.get('email')
    userpassword = request.POST.get('password')

    try:
        userdata = User.objects.get(email=useremail, password=userpassword)
        request.session['userlogid'] = userdata.id
        request.session['userlogname'] = userdata.uname
        request.session['userlogmail'] = userdata.email

    except:
        userdata = None

    try:
        leaserdata = Leaser.objects.get(email=useremail, password=userpassword)
        request.session['leaserlogid'] = leaserdata.id
        request.session['leaserlogname'] = leaserdata.lname
        request.session['leaserlogmail'] = leaserdata.email
    except:
        leaserdata = None

    try:
        driverdata = Driver.objects.get(email=useremail, password=userpassword)
        request.session['driverlogid'] = driverdata.id
        request.session['driverlogname'] = driverdata.dname
        request.session['driverlogmail'] = driverdata.email
    except:
        driverdata = None

    if userdata is not None:
        messages.success(request, "Login successful!!")
        context = {"user": userdata}
        return render(request, "home.html", context)
    elif leaserdata is not None:
        messages.success(request, "Login successful!!")
        return redirect("/")
    elif driverdata is not None:
        messages.success(request, "Login successful!!")
        return redirect("/")
    else:
        messages.error(request, "Login failed!!")

    return render(request, 'login.html')


# def logout(request):
#     try:
#         del request.session['userlogid']
#         del request.session['userlogname']
#         del request.session['userlogmail']
#         users = User.objects.all()
#         u = {'udata': users}
#         return render(request, 'home.html', u)
#     except:
#         pass
#     try:
#         del request.session['leaserlogid']
#         del request.session['leaserlogname']
#         del request.session['leaserlogmail']
#         leasers = Leaser.objects.all()
#         l = {'ldata': leasers}
#         return render(request, 'home.html', l)
#     except:
#         pass
#
#     try:
#         del request.session['driverlogid']
#         del request.session['driverlogname']
#         del request.session['driverlogmail']
#         drivers = Driver.objects.all()
#         d = {'ddata': drivers}
#         return render(request, 'home.html', d)
#     except:
#         pass
#
#     return redirect("/")

def logout(request):
    request.session.flush()
    return redirect('/')

def bikes(request):
    return render(request, 'bikes.html')


def practice(request, id):
    vehicle = Vehicle.objects.get(id=id)
    return render(request, 'practice.html', {'data': vehicle})


def vehicle(request):
    vehicles = Vehicle.objects.exclude(vcategory__catname__iexact='Bike')
    categories = Vehicle_category.objects.exclude(catname__iexact='Bike')

    category = request.GET.get('category')
    subcategory = request.GET.get('subcategory')
    fuel_type = request.GET.get('fueltype')
    seats = request.GET.get('seats')

    if category:
        vehicles = vehicles.filter(vcategory__catname__iexact=category)
    if subcategory:
        vehicles = vehicles.filter(vsubcategory__subcatname__iexact=subcategory)
    if fuel_type:
        vehicles = vehicles.filter(fuel_type__iexact=fuel_type)
    if seats:
        if seats == "10+":
            vehicles = vehicles.filter(seats__gte=10)
        else:
            vehicles = vehicles.filter(seats=seats)

    context = {
        'vehicles': vehicles,
        'categories': categories,
        'selected_category': category,
        'selected_subcategory': subcategory,
        'selected_fuel': fuel_type,
        'selected_seats': seats,
    }
    return render(request, 'vehicles.html', context)



def singlecar(request, id):
    vehicle = Vehicle.objects.get(id=id)

    doc_status = None

    if request.session.get('userlogid'):
        user_id = request.session.get('userlogid')

        try:
            doc = Documents.objects.get(
                user_id=user_id,
                document_type='1'   # Aadhaar
            )

            if doc.verification_status:
                doc_status = 'verified'
            else:
                doc_status = 'pending'

        except Documents.DoesNotExist:
            doc_status = 'not_uploaded'

    context = {
        'vehicle': vehicle,
        'doc_status': doc_status
    }

    return render(request, 'singlecar.html', context)

def booking(request, id):
    vehicledata = Vehicle.objects.get(id=id)

    if vehicledata.available_status == False:
        category = vehicledata.vcategory.catname.upper()

        if category in ["CAR", "SUV", "VAN"]:
            messages.error(request, "Vehicle not available")
            return redirect("/vehicle")

        elif category == "BIKE":
            messages.error(request, "Bike not available")
            return redirect("/bikes")

    userlogin = request.session.get('userlogid')
    user = User.objects.get(id=userlogin)

    license_doc = Documents.objects.filter(
        user_id=user,
        document_type='2'
    ).first()

    context = {
        'vehicle': vehicledata,
        'user': user,
        'license_doc': license_doc
    }

    return render(request, 'booking.html', context)


def about(request):
    total_users = User.objects.count()
    total_bookings = Booking.objects.count()

    context = {
        'total_users': total_users,
        'total_bookings': total_bookings,
    }

    return render(request, 'about.html', context)


def contact(request):
    return render(request, 'contact.html')


def reciept(request):
    return render(request, 'reciept.html')





def confirm_booking(request, id):
    if request.method != "POST":
        return redirect("/")

    vehicle = Vehicle.objects.get(id=id)
    userid = request.session.get('userlogid')

    if not userid:
        messages.error(request, "Please login first")
        return redirect("/login")

    booking_type = request.POST.get('booking_type')
    pickup_location = request.POST.get('pickup_location') or None
    pickup_time = request.POST.get('pickup_time') or None
    start_date = request.POST.get('start_date')
    return_date = request.POST.get('return_date')

    # ✅ Validate dates
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(return_date, "%Y-%m-%d").date()
    except:
        messages.error(request, "Invalid date format")
        return redirect(f'/booking/{vehicle.id}')

    today = date.today()
    max_date = today + timedelta(days=14)

    if start < today or start > max_date:
        messages.error(request, "Start date must be within next 14 days only.")
        return redirect(f'/booking/{vehicle.id}')

    if end < start:
        messages.error(request, "Return date must be after start date.")
        return redirect(f'/booking/{vehicle.id}')

    user = User.objects.get(id=userid)
    leaser = vehicle.leaser_id

    # ✅ Driver logic (FIXED)
    driver = None
    driver_fee_per_day = 0   # default

    if booking_type == "with_driver":
        driver = Driver.objects.filter(is_available=True).first()
        if not driver:
            messages.error(request, "No drivers available")
            return redirect(f'/booking/{vehicle.id}')

        driver_fee_per_day = 800

        # 🔥 mark driver busy
        driver.is_available = False
        driver.save()

    elif booking_type == "self_drive":
        driver = None
        driver_fee_per_day = 0

        # 👇 force blank values
        pickup_location = None
        pickup_time = None

    else:
        messages.error(request, "Invalid booking type")
        return redirect(f'/booking/{vehicle.id}')

    # ✅ Calculate days
    days = max((end - start).days, 1)

    total_amount = days * vehicle.fare
    security_deposit = total_amount * 0.20
    total_driver_fee = driver_fee_per_day * days

    # ✅ Create booking
    booking = Booking.objects.create(
        user_id=user,
        vehicle_id=vehicle,
        leaser_id=leaser,
        driver_id=driver,
        booking_type=booking_type,
        pickup_location=pickup_location,
        pickup_time=pickup_time,
        start_date=start,
        end_date=end,
        total_driver_fee=total_driver_fee,
        total_amount=total_amount,
        security_deposit=security_deposit,
        booking_status=False,

        # ✅ ride status
        ride_status='not_started'
    )

    request.session['last_booking_id'] = booking.id

    return redirect("/payment")


def payment(request):
    booking_id = request.session.get('last_booking_id')

    if not booking_id:
        messages.error(request, "No booking found")
        return redirect("/")

    messages.success(request, "Booking successful!")

    booking = Booking.objects.get(id=booking_id)

    days = max((booking.end_date - booking.start_date).days, 1)

    deposit = booking.security_deposit
    total_amount = booking.total_amount

    # ✅ DRIVER LOGIC (FIXED)
    driver_fee = booking.total_driver_fee
    driver_fee_per_day = 800



    # ✅ Final payable
    payable_amount = total_amount + deposit + driver_fee

    context = {
        'booking': booking,
        'vehicle': booking.vehicle_id,
        'user': booking.user_id,
        'days': days,

        'amount': total_amount,
        'deposit': deposit,
        'payable_amount': payable_amount,

        # ✅ driver data
        'driver_fee': driver_fee,
        'driver_fee_per_day': driver_fee_per_day,
    }

    return render(request, 'payment.html', context)


def paymentprocess(request):
    if request.method != "POST":
        return redirect("/")

    userid = request.session.get('userlogid')
    booking_id = request.session.get('last_booking_id')

    if not userid or not booking_id:
        messages.error(request, "Invalid payment attempt")
        return redirect("/")

    booking = Booking.objects.get(id=booking_id)

    vehicle = booking.vehicle_id

    # ✅ Driver logic (FIXED)
    driver = None
    if booking.booking_type == "with_driver" and booking.driver_id:
        driver = booking.driver_id

    amount = request.POST.get('amount')
    paymentmethod = request.POST.get('paymentmethod')

    # ================= CASH PAYMENT =================
    if paymentmethod == "Cash":
        Payment.objects.create(
            user_id=User(id=userid),
            booking_id=booking,
            amount=amount,
            payment_type=paymentmethod
        )

        booking.booking_status = True
        booking.save()

        if driver:
            driver.is_available = False
            driver.save()

            Assign_Driver.objects.create(
                booking_id=booking,
                driver_id=driver,
                status=True
            )

        vehicle.available_status = "3"
        vehicle.save()

        messages.success(request, "Your ride has been booked. Cash payment will be collected.")
        return redirect("/bookinghistory")

    # ================= ONLINE PAYMENT =================
    elif paymentmethod == "Online":

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET_KEY)
        )

        pay_amount = int(float(amount) * 100)

        razorpay_order = client.order.create({
            "amount": pay_amount,
            "currency": "INR",
            "receipt": f"order_{booking_id}",
            "payment_capture": 1,
        })

        # ✅ Only create payment record (light)
        Payment.objects.create(
            user_id=User(id=userid),
            booking_id=booking,
            amount=amount,
            payment_type=paymentmethod,
            razorpay_id=razorpay_order['id']
        )

        return render(request, "reciept.html", {
            "razorpay_order_id": razorpay_order['id'],
            "amount": pay_amount,
            "key": settings.RAZORPAY_KEY_ID,
            "currency": "INR",
        })
    return redirect("/payment")


def payment_success(request):
    booking_id = request.session.get('last_booking_id')

    booking = Booking.objects.get(id=booking_id)
    vehicle = booking.vehicle_id

    driver = None
    if booking.booking_type == "with_driver" and booking.driver_id:
        driver = booking.driver_id

    # ✅ NOW update after payment success
    booking.booking_status = True
    booking.save()

    if driver:
        driver.is_available = False
        driver.save()

        Assign_Driver.objects.create(
            booking_id=booking,
            driver_id=driver,
            status=True
        )

    vehicle.available_status = "3"
    vehicle.save()

    messages.success(request, "Payment successful & ride booked!")
    return redirect("/bookinghistory")


def userprofile(request):
    user_id = request.session.get('userlogid')

    if not user_id:
        return redirect("/login")

    user = User.objects.get(id=user_id)

    if request.method == "POST" and "update_profile" in request.POST:

        name = request.POST.get("name", "").strip()
        contact = request.POST.get("contact", "").strip()
        age = request.POST.get("age", "").strip()
        address = request.POST.get("address", "").strip()

        new_password = request.POST.get("new_password", "").strip()
        confirm_password = request.POST.get("confirm_password", "").strip()

        changed = False

        if name and name != user.uname:
            user.uname = name
            request.session["userlogname"] = name
            changed = True
        if contact and contact != user.contact:
            user.contact = contact
            changed = True
        if age and str(user.age) != str(age):
            user.age = int(age)
            changed = True
        if address and address != user.address:
            user.address = address
            changed = True
        if request.FILES.get("pfp"):
            user.profile_pic = request.FILES["pfp"]
            changed = True
        if new_password:
            if new_password == confirm_password:
                user.password = new_password
                changed = True
            else:
                messages.error(request, "Passwords do not match ❌")
                return redirect("/userprofile")
        if not changed:
            messages.info(request, "No changes detected ")
            return redirect("/userprofile")

        user.save()
        messages.success(request, "Profile updated successfully ")
        return redirect("/userprofile")

    return render(request, 'userprofile.html', {'user': user})


def changeuserprofile(request):
    userid = request.session.get('userlogid')
    user = User.objects.get(id=userid)
    if request.method == "POST":

        if request.FILES.get('pfp') is not None:
            pfp = request.FILES.get('pfp')
            user.profile_pic = pfp
            user.save()
            messages.success(request, "Profile Picture Updated successfully.")
        else:
            user.profile_pic = user.profile_pic
            user.save()
            messages.error(request, "Profile Picture Not Updated , Please select New Profile Picture.")

    return redirect('/userprofile')


def driverprofile(request):
    driver_id = request.session.get("driverlogid")

    if not driver_id:
        return redirect("login")

    driver = Driver.objects.get(id=driver_id)

    if request.method == "POST" and "update_profile" in request.POST:

        name = request.POST.get("name", "").strip()
        contact = request.POST.get("contact", "").strip()
        gender = request.POST.get("gender", "").strip()

        new_password = request.POST.get("new_password", "").strip()
        confirm_password = request.POST.get("confirm_password", "").strip()


        changed = False

        if name and name != driver.dname:
            driver.dname = name
            request.session["driverlogname"] = name
            changed = True
        if contact and contact != driver.contact:
            driver.contact = contact
            changed = True
        if gender and gender != driver.gender:
            driver.gender = gender
            changed = True

        available = request.POST.get("available_status")
        new_status = True if available == "on" else False

        if driver.is_available != new_status:
            driver.is_available = new_status
            changed = True

        if request.FILES.get("pfp"):
            driver.profile_pic = request.FILES["pfp"]
            changed = True

        if new_password:
            if new_password == confirm_password:
                driver.password = new_password
                changed = True
            else:
                messages.error(request, "Passwords do not match ❌")
                return redirect("/driverprofile")

        if not changed:
            messages.info(request, "No changes detected")
            return redirect("/driverprofile")

        driver.save()
        messages.success(request, "Profile updated successfully")
        return redirect("/driverprofile")

    return render(request, "driverprofile.html", {"driver": driver})


def changedriverprofile(request):
    driverid = request.session.get('driverlogid')
    driver = Driver.objects.get(id=driverid)
    if request.method == "POST":

        if request.FILES.get('pfp') is not None:
            pfp = request.FILES.get('pfp')
            driver.profile_pic = pfp
            driver.save()
            messages.success(request, "Profile Picture Updated successfully.")
        else:
            driver.profile_pic = driver.profile_pic
            driver.save()
            messages.error(request, "Profile Picture Not Updated , Please select New Profile Picture.")

    return redirect('/driverprofile')


def manage_documents(request):
    user_id = request.session.get('userlogid')
    leaser_id = request.session.get('leaserlogid')
    driver_id = request.session.get('driverlogid')

    person_obj = None
    role = None
    existing_docs = []

    allowed_options = {}

    if user_id:
        role = 'user'
        person_obj = User.objects.get(id=user_id)
        existing_docs = Documents.objects.filter(user_id=person_obj)
        allowed_options = {'1': 'Aadhar Card', '2': 'Driving License'}

    elif leaser_id:
        role = 'leaser'
        person_obj = Leaser.objects.get(id=leaser_id)
        existing_docs = Documents.objects.filter(leaser_id=person_obj)
        allowed_options = {'1': 'Aadhar Card', '2': 'Driving License', '6': 'PAN Card'}

    elif driver_id:
        role = 'driver'
        person_obj = Driver.objects.get(id=driver_id)
        existing_docs = Documents.objects.filter(driver_id=person_obj)
        allowed_options = {'1': 'Aadhar Card', '2': 'Driving License'}

    else:
        messages.error(request, "Please login to manage documents.")
        return redirect("/login")

    if request.method == "POST":
        doc_type = request.POST.get('document_type')
        doc_number = request.POST.get('document_number', '').strip() or None
        issue_date_raw = request.POST.get('issue_date', '').strip()
        expiry_date_raw = request.POST.get('expiry_date', '').strip()
        doc_file = request.FILES.get('doc_file')

        if doc_type not in allowed_options:
            messages.error(request, "Invalid document type for your account.")
            return redirect("/document")

        issue_date = parse_date(issue_date_raw) if issue_date_raw else None
        expiry_date = parse_date(expiry_date_raw) if expiry_date_raw else None

        existing = None
        if role == 'user':
            existing = Documents.objects.filter(user_id=person_obj, document_type=doc_type).first()
        elif role == 'leaser':
            existing = Documents.objects.filter(leaser_id=person_obj, document_type=doc_type).first()
        elif role == 'driver':
            existing = Documents.objects.filter(driver_id=person_obj, document_type=doc_type).first()

        if existing:
            if doc_number: existing.document_number = doc_number
            if issue_date: existing.issue_date = issue_date
            if expiry_date: existing.expiry_date = expiry_date
            if doc_file: existing.doc_file = doc_file

            existing.verification_status = False
            existing.save()
            messages.success(request, "Document updated successfully.")
        else:
            new_doc = Documents(
                document_type=doc_type,
                document_number=doc_number,
                issue_date=issue_date,
                expiry_date=expiry_date,
                doc_file=doc_file,
                verification_status=False
            )

            if role == 'user':
                new_doc.user_id = person_obj
            elif role == 'leaser':
                new_doc.leaser_id = person_obj
            elif role == 'driver':
                new_doc.driver_id = person_obj

            new_doc.save()
            messages.success(request, "Document uploaded successfully.")

        return redirect("/document")

    context = {
        "role": role,
        "person": person_obj,
        "existing_docs": existing_docs,
        "allowed_options": allowed_options,
    }
    return render(request, "document.html", context)


def delete_document(request, id):
    if request.method == "POST":
        try:
            doc = Documents.objects.get(id=id)
            doc.delete()
            messages.success(request, "Document removed successfully!")
        except Documents.DoesNotExist:
            messages.error(request, "Document not found.")

    return redirect("/document")


def changeleaserprofile(request):
    leaserid = request.session.get('leaserlogid')
    leaser = Leaser.objects.get(id=leaserid)
    if request.method == "POST":

        if request.FILES.get('pfp') is not None:
            pfp = request.FILES.get('pfp')
            leaser.profile_pic = pfp
            leaser.save()
            messages.success(request, "Profile Picture Updated successfully.")
        else:
            leaser.profile_pic = leaser.profile_pic
            leaser.save()
            messages.error(request, "Profile Picture Not Updated , Please select New Profile Picture.")

    return redirect('/leaserprofile')


def leaserprofile(request):
    leaser_id = request.session.get("leaserlogid")

    if not leaser_id:
        return redirect("login")

    leaser = Leaser.objects.get(id=leaser_id)

    if request.method == "POST" and "update_profile" in request.POST:

        lname = request.POST.get("lname", "").strip()
        contact = request.POST.get("contact", "").strip()
        age = request.POST.get("age", "").strip()
        address = request.POST.get("address", "").strip()

        new_password = request.POST.get("new_password", "").strip()
        confirm_password = request.POST.get("confirm_password", "").strip()

        changed = False

        if lname and lname != leaser.lname:
            leaser.lname = lname
            request.session["leaserlogname"] = lname
            changed = True
        if contact and contact != leaser.contact:
            leaser.contact = contact
            changed = True
        if age and str(leaser.age) != str(age):
            leaser.age = int(age)
            changed = True
        if request.FILES.get("pfp"):
            leaser.profile_pic = request.FILES["pfp"]
            changed = True

        if new_password:
            if new_password == confirm_password:
                leaser.password = new_password
                changed = True
            else:
                messages.error(request, "Passwords do not match ❌")
                return redirect("/leaserprofile")

        if not changed:
            messages.info(request, "No changes detected")
            return redirect("/leaserprofile")

        leaser.save()
        messages.success(request, "Profile updated successfully")
        return redirect("/leaserprofile")

    return render(request, "leaserprofile.html", {"leaser": leaser})



def leaser_add_car(request):
    categories = Vehicle_category.objects.all()
    subcategories = Vehicle_subcategory.objects.all()

    leaser_id = request.session.get("leaserlogid")

    if not leaser_id:
        messages.error(request, "Please login first.")
        return redirect("/")

    leaser = Leaser.objects.get(id=leaser_id)

    REQUIRED_DOCS = ['1', '2', '6']

    docs = Documents.objects.filter(leaser_id=leaser)
    uploaded_doc_types = list(docs.values_list('document_type', flat=True))
    missing_docs = [doc for doc in REQUIRED_DOCS if doc not in uploaded_doc_types]
    docs_uploaded = len(missing_docs) == 0

    required_docs_qs = docs.filter(document_type__in=REQUIRED_DOCS)
    docs_verified = docs_uploaded and not required_docs_qs.filter(verification_status=False).exists()

    if request.method == "POST":

        if not docs_uploaded:
            messages.error(request, "Please upload Aadhar Card, PAN Card, and Driving License first.")
            return redirect("/leaser_add_car")

        if not docs_verified:
            messages.warning(request, "Your documents are under verification. Please wait for admin approval.")
            return redirect("/leaser_add_car")

        agree_terms = request.POST.get("agree_terms")
        if not agree_terms:
            messages.error(request, "You must agree to the Rideplex terms before adding a vehicle.")
            return redirect("/leaser_add_car")

        vcategory_id = request.POST.get("vcategory")
        vsubcategory_name = request.POST.get("vsubcategory")

        brand = request.POST.get("brand")
        model = request.POST.get("model")
        fueltype = request.POST.get("fueltype")
        seats = request.POST.get("seats")
        fare = request.POST.get("fare")

        # Ensure it is uppercase for consistent checking
        registration_number = request.POST.get("registration_number").upper()

        # =====================================================================
        # UPDATED: Check if registration number already exists globally
        # =====================================================================
        if Vehicle.objects.filter(registration_number=registration_number).exists():
            messages.error(request,
                           f"Validation Error: The registration number '{registration_number}' is already registered to another vehicle in the database.")
            return redirect("/leaser_add_car")

        vehicle_img = request.FILES.get("vehicle_img")
        front_angle = request.FILES.get("front_angle")
        leftside_angle = request.FILES.get("leftside_angle")
        rightside_angle = request.FILES.get("rightside_angle")

        # --- EXTRACT DOCUMENT DATA ---
        rc_book = request.FILES.get("rc_book")
        rc_number = request.POST.get("rc_number")
        rc_issue_date = request.POST.get("rc_issue_date") or None
        rc_expiry_date = request.POST.get("rc_expiry_date") or None

        insurance = request.FILES.get("insurance")
        insurance_number = request.POST.get("insurance_number")
        insurance_issue_date = request.POST.get("insurance_issue_date") or None
        insurance_expiry_date = request.POST.get("insurance_expiry_date") or None

        puc = request.FILES.get("puc")
        puc_number = request.POST.get("puc_number")
        puc_issue_date = request.POST.get("puc_issue_date") or None
        puc_expiry_date = request.POST.get("puc_expiry_date") or None

        # Server-side validation for dates
        def validate_dates(issue, expiry, name):
            if issue and expiry:
                if parse_date(expiry) <= parse_date(issue):
                    return f"{name} Expiry date must be strictly after the Issue date."
            return None

        err_msg = validate_dates(rc_issue_date, rc_expiry_date, "RC") or \
                  validate_dates(insurance_issue_date, insurance_expiry_date, "Insurance") or \
                  validate_dates(puc_issue_date, puc_expiry_date, "PUC")

        if err_msg:
            messages.error(request, err_msg)
            return redirect("/leaser_add_car")

        if not rc_book or not insurance or not puc:
            messages.error(request, "Please upload RC Book, Insurance, and PUC for the vehicle.")
            return redirect("/leaser_add_car")

        status = '2'

        try:
            category_obj = Vehicle_category.objects.get(id=vcategory_id)
        except Vehicle_category.DoesNotExist:
            messages.error(request, "Invalid vehicle category selected.")
            return redirect("/leaser_add_car")

        subcategory_obj, created = Vehicle_subcategory.objects.get_or_create(
            vcategory=category_obj,
            subcatname=vsubcategory_name,
            defaults={'description': f'Auto-created {vsubcategory_name} category'}
        )

        Vehicle.objects.create(
            leaser_id=leaser,
            vcategory=category_obj,
            vsubcategory=subcategory_obj,
            brand=brand,
            model=model,
            fuel_type=fueltype,
            seats=seats,
            fare=fare,
            registration_number=registration_number,
            vehicle_img=vehicle_img,
            front_angle=front_angle,
            leftside_angle=leftside_angle,
            rightside_angle=rightside_angle,
            available_status=status,

            rc_book=rc_book,
            rc_number=rc_number,
            rc_issue_date=rc_issue_date,
            rc_expiry_date=rc_expiry_date,
            rc_verified=False,

            insurance=insurance,
            insurance_number=insurance_number,
            insurance_issue_date=insurance_issue_date,
            insurance_expiry_date=insurance_expiry_date,
            insurance_verified=False,

            puc=puc,
            puc_number=puc_number,
            puc_issue_date=puc_issue_date,
            puc_expiry_date=puc_expiry_date,
            puc_verified=False,
        )

        messages.success(request, "Vehicle added successfully!")
        return redirect("/leaser_add_car")

    # =====================================================================
    # NEW: Fetch existing registration numbers for frontend Parsley validation
    # =====================================================================
    existing_regs = list(Vehicle.objects.values_list('registration_number', flat=True))
    existing_regs_json = json.dumps([str(r).upper() for r in existing_regs if r])

    return render(request, "leaser_add_car.html", {
        "categories": categories,
        "subcategories": subcategories,
        "leaser_name": leaser.lname,
        "docs_uploaded": docs_uploaded,
        "docs_verified": docs_verified,
        "existing_regs_json": existing_regs_json # <-- ADD THIS HERE
    })
def leaser_bookings(request):
    if 'leaserlogid' not in request.session:
        return redirect('login')

    leaser_id = request.session['leaserlogid']

    # ✅ Get leaser safely
    try:
        leaser = Leaser.objects.get(id=leaser_id)
    except Leaser.DoesNotExist:
        return redirect('login')

    bookingdata= Booking.objects.filter(leaser_id=leaser)




    return render(request, "leaser_bookings.html" , {"bookings": bookingdata})


def leaser_cars(request):
    # 🔒 Session check
    if 'leaserlogid' not in request.session:
        return redirect('login')

    leaser_id = request.session['leaserlogid']

    try:
        leaser = Leaser.objects.get(id=leaser_id)
    except Leaser.DoesNotExist:
        return redirect('login')

    # 🚗 Vehicles
    vehicles = Vehicle.objects.filter(leaser_id=leaser_id)

    # 📦 Bookings
    bookings = Booking.objects.filter(leaser_id=leaser_id)

    # =========================
    # 📊 STATS
    # =========================
    total_cars = vehicles.count()
    active_rentals = vehicles.filter(available_status='3').count()
    available_cars = vehicles.filter(available_status='1').count()

    # 🗓️ Current time
    now = timezone.now()

    # 💰 Monthly Earnings (after 15% deduction per ride)
    monthly_earnings = 0
    leaser_earning = 0
    for b in bookings:
        if b.ride_status == "completed" and b.booking_date.month == now.month and b.booking_date.year == now.year:
            leaser_earning = b.total_amount * 0.85 #15% platform charges deducted per ride


    # =========================
    # 🔥 REQUEST STATUS (LATEST PER VEHICLE)
    # =========================

    requests = VehicleReturnRequest.objects.filter(
        leaser_id=leaser_id
    ).order_by('-created_at')

    request_map = {}

    for r in requests:
        vid = r.vehicle_id_id   # faster than r.vehicle_id.id
        if vid not in request_map:
            request_map[vid] = r.status

    # attach status
    for car in vehicles:
        car.request_status = request_map.get(car.id, None)

    # =========================
    # 🚀 RENDER
    # =========================
    return render(request, 'leaser_cars.html', {
        'vehicles': vehicles,
        'leaser_name': leaser.lname,

        # stats
        'total_cars': total_cars,
        'active_rentals': active_rentals,
        'available_cars': available_cars,
        'monthly_earnings': leaser_earning,
    })


def editvehicle(request, id):
    vehicle_details = Vehicle.objects.get(id=id)
    categories = Vehicle_category.objects.all()
    subcategories = Vehicle_subcategory.objects.all()

    # =====================================================================
    # NEW: Fetch existing registration numbers (EXCLUDING the current vehicle)
    # This powers the live Parsley.js frontend validation
    # =====================================================================
    existing_regs = list(Vehicle.objects.exclude(id=id).values_list('registration_number', flat=True))
    existing_regs_json = json.dumps([str(r).upper() for r in existing_regs if r])

    context = {
        "vehicle": vehicle_details,
        "categories": categories,
        "subcategories": subcategories,
        "existing_regs_json": existing_regs_json # Passed to frontend here
    }

    return render(request, "leaser_edit.html", context)



def assign_ride(request):
    if 'driverlogid' not in request.session:
        return redirect('/login')

    driver_id = request.session['driverlogid']
    driver = Driver.objects.get(id=driver_id)

    # Assigned rides
    assigned_rides = Assign_Driver.objects.filter(
        driver_id=driver,
        status=True
    )

    # Completed rides count
    completed_rides = assigned_rides.filter(
        booking_id__ride_status='completed'
    ).count()

    # ✅ FIX HERE
    bookings = Booking.objects.filter(driver_id=driver)

    # 🗓️ Current time
    now = timezone.now()

    # 💰 Monthly Earnings (FULL amount)
    driver_earnings = 0

    for b in bookings:
        if b.ride_status == "completed" and b.booking_date.month == now.month and b.booking_date.year == now.year:
            driver_earnings += b.total_driver_fee

    context = {
        "assigned_rides": assigned_rides,
        "completed_rides": completed_rides,
        "monthly_earnings": driver_earnings,
    }

    return render(request, "assign_ride.html", context)


def delete_assignment(request, id):
    assignment = Assign_Driver.objects.get(id=id)
    driver_id = request.session.get('driverlogid')

    if driver_id and assignment.driver_id.id == driver_id:
        assignment.delete()

    return redirect('/assign_ride')

def updatevehicle(request):
    if request.method == "POST":
        vehicleid = request.POST.get("vehicleid")
        brand = request.POST.get("brand")
        model = request.POST.get("model")
        # Ensure it is uppercase for consistent checking
        registration_number = request.POST.get("registration_number").upper()
        fare = request.POST.get("fare")

        # =====================================================================
        # Backend Check: Prevent saving if registration number already exists
        # (excluding this specific car)
        # =====================================================================
        if Vehicle.objects.filter(registration_number=registration_number).exclude(id=vehicleid).exists():
            messages.error(request, f"Validation Error: The registration number '{registration_number}' is already registered to another vehicle in the database.")
            return redirect(f"/editvehicle/{vehicleid}")

        fueltype = request.POST.get("fueltype")
        seats = request.POST.get("seats")
        category_id = request.POST.get("vcategory")
        subcategory_val = request.POST.get("vsubcategory")

        vehicle = Vehicle.objects.get(id=vehicleid)
        category_obj = Vehicle_category.objects.get(id=category_id)

        if subcategory_val.isdigit():
            subcategory_obj = Vehicle_subcategory.objects.get(id=subcategory_val)
        else:
            subcategory_obj, created = Vehicle_subcategory.objects.get_or_create(
                vcategory=category_obj,
                subcatname=subcategory_val,
                defaults={'description': f'Auto-created {subcategory_val} category'}
            )

        vehicle.brand = brand
        vehicle.model = model
        vehicle.registration_number = registration_number
        vehicle.fare = fare
        vehicle.vcategory = category_obj
        vehicle.vsubcategory = subcategory_obj

        vehicle.available_status = '2'

        if fueltype:
            vehicle.fuel_type = fueltype
        if seats:
            vehicle.seats = seats

        if "vehicle_img" in request.FILES:
            vehicle.vehicle_img = request.FILES["vehicle_img"]
        if "front_angle" in request.FILES:
            vehicle.front_angle = request.FILES["front_angle"]
        if "leftside_angle" in request.FILES:
            vehicle.leftside_angle = request.FILES["leftside_angle"]
        if "rightside_angle" in request.FILES:
            vehicle.rightside_angle = request.FILES["rightside_angle"]

        rc_number = request.POST.get("rc_number")
        rc_issue_date = request.POST.get("rc_issue_date")
        rc_expiry_date = request.POST.get("rc_expiry_date")

        insurance_number = request.POST.get("insurance_number")
        insurance_issue_date = request.POST.get("insurance_issue_date")
        insurance_expiry_date = request.POST.get("insurance_expiry_date")

        puc_number = request.POST.get("puc_number")
        puc_issue_date = request.POST.get("puc_issue_date")
        puc_expiry_date = request.POST.get("puc_expiry_date")

        # Server-side Date Validation Before Updating
        def validate_dates(issue, expiry, name):
            if str(issue) in ["None", "", "False"] or str(expiry) in ["None", "", "False"]:
                return None

            parsed_issue = parse_date(str(issue))
            parsed_expiry = parse_date(str(expiry))

            if parsed_issue and parsed_expiry:
                if parsed_expiry <= parsed_issue:
                    return f"{name} Expiry date must be strictly after the Issue date."
            return None

        err_msg = validate_dates(rc_issue_date or str(vehicle.rc_issue_date),
                                 rc_expiry_date or str(vehicle.rc_expiry_date), "RC") or \
                  validate_dates(insurance_issue_date or str(vehicle.insurance_issue_date),
                                 insurance_expiry_date or str(vehicle.insurance_expiry_date), "Insurance") or \
                  validate_dates(puc_issue_date or str(vehicle.puc_issue_date),
                                 puc_expiry_date or str(vehicle.puc_expiry_date), "PUC")

        if err_msg:
            messages.error(request, err_msg)
            return redirect(f"/editvehicle/{vehicle.id}")

        # RC Update checks
        rc_updated = False
        if "rc_book" in request.FILES:
            vehicle.rc_book = request.FILES["rc_book"]
            rc_updated = True
        if rc_number and rc_number != vehicle.rc_number:
            vehicle.rc_number = rc_number
            rc_updated = True
        if rc_issue_date and str(rc_issue_date) != str(vehicle.rc_issue_date):
            vehicle.rc_issue_date = rc_issue_date
            rc_updated = True
        if rc_expiry_date and str(rc_expiry_date) != str(vehicle.rc_expiry_date):
            vehicle.rc_expiry_date = rc_expiry_date
            rc_updated = True
        if rc_updated:
            vehicle.rc_verified = False

        # Insurance Update checks
        ins_updated = False
        if "insurance" in request.FILES:
            vehicle.insurance = request.FILES["insurance"]
            ins_updated = True
        if insurance_number and insurance_number != vehicle.insurance_number:
            vehicle.insurance_number = insurance_number
            ins_updated = True
        if insurance_issue_date and str(insurance_issue_date) != str(vehicle.insurance_issue_date):
            vehicle.insurance_issue_date = insurance_issue_date
            ins_updated = True
        if insurance_expiry_date and str(insurance_expiry_date) != str(vehicle.insurance_expiry_date):
            vehicle.insurance_expiry_date = insurance_expiry_date
            ins_updated = True
        if ins_updated:
            vehicle.insurance_verified = False

        # PUC Update checks
        puc_updated = False
        if "puc" in request.FILES:
            vehicle.puc = request.FILES["puc"]
            puc_updated = True
        if puc_number and puc_number != vehicle.puc_number:
            vehicle.puc_number = puc_number
            puc_updated = True
        if puc_issue_date and str(puc_issue_date) != str(vehicle.puc_issue_date):
            vehicle.puc_issue_date = puc_issue_date
            puc_updated = True
        if puc_expiry_date and str(puc_expiry_date) != str(vehicle.puc_expiry_date):
            vehicle.puc_expiry_date = puc_expiry_date
            puc_updated = True
        if puc_updated:
            vehicle.puc_verified = False

        vehicle.save()

        messages.success(request, "Vehicle details updated successfully!")
        return redirect("/leaser_cars")

    # Fallback if accessed via GET method
    return redirect("/leaser_cars")

def feedback_view(request):
    user_id = request.session.get('userlogid')
    driver_id = request.session.get('driverlogid')
    leaser_id = request.session.get('leaserlogid')

    if not user_id and not driver_id and not leaser_id:
        messages.error(request, "Please login first")
        return redirect("/login")

    if request.method == "POST":

        rating = request.POST.get("rating")
        comment = request.POST.get("comment")

        feedback = Feedback(
            rating=rating,
            comment=comment
        )

        if user_id:
            feedback.user_id = User.objects.get(id=user_id)
        if driver_id:
            feedback.driver_id = Driver.objects.get(id=driver_id)
        if leaser_id:
            feedback.leaser_id = Leaser.objects.get(id=leaser_id)

        feedback.save()
        messages.success(request, "Feedback submitted successfully!")
        return redirect("/support")

    return render(request, "contact.html")


def deletevehicle(request, id):
    try:
        vehicle = Vehicle.objects.get(id=id)
        vehicle.delete()
        messages.success(request, "Vehicle Removed Successfully")
        return redirect("/leaser_cars")
    except:
        pass

    return redirect("/leaser_cars")


def complaint_view(request):
    user_id = request.session.get('userlogid')
    driver_id = request.session.get('driverlogid')
    leaser_id = request.session.get('leaserlogid')

    if not user_id and not driver_id and not leaser_id:
        messages.error(request, "Please login first")
        return redirect("/login")

    if request.method == "POST":

        title = request.POST.get("title")
        description = request.POST.get("description")

        complaint = Complaint(
            title=title,
            description=description
        )

        if user_id:
            complaint.user_id = User.objects.get(id=user_id)
        if driver_id:
            complaint.driver_id = Driver.objects.get(id=driver_id)
        if leaser_id:
            complaint.leaser_id = Leaser.objects.get(id=leaser_id)

        complaint.save()
        messages.success(request, "Complaint submitted successfully!")
        return redirect("/support")

    return render(request, "contact.html")


# def forgot_password(request):
#     if request.method == "POST":
#
#         email = request.POST.get("email")
#
#         user = User.objects.filter(email=email).first()
#         leaser = Leaser.objects.filter(email=email).first()
#         driver = Driver.objects.filter(email=email).first()
#
#         if user:
#             request.session['reset_email'] = email
#             request.session['reset_type'] = "user"
#             return redirect("/reset_password")
#         elif leaser:
#             request.session['reset_email'] = email
#             request.session['reset_type'] = "leaser"
#             return redirect("/reset_password")
#         elif driver:
#             request.session['reset_email'] = email
#             request.session['reset_type'] = "driver"
#             return redirect("/reset_password")
#         else:
#             messages.error(request, "Email not registered")
#
#     return render(request, "forgot_password.html")





def bikes(request):
    vehicles = Vehicle.objects.filter(vcategory__catname__iexact='Bike')
    subcategory = request.GET.get('subcategory')
    fuel_type = request.GET.get('fueltype')

    if subcategory:
        vehicles = vehicles.filter(vsubcategory__subcatname__iexact=subcategory)
    if fuel_type:
        vehicles = vehicles.filter(fuel_type__iexact=fuel_type)

    context = {
        'vehicles': vehicles,
        'selected_subcategory': subcategory,
        'selected_fuel': fuel_type,
    }
    return render(request, 'bikes.html', context)


def book(request):
    if 'userlogid' not in request.session:
        return redirect('/login')

    user_id = request.session['userlogid']
    user = User.objects.get(id=user_id)

    bookingdata = Booking.objects.filter(
        user_id=user
    ).select_related('vehicle_id', 'driver_id')

    for b in bookingdata:
        b.total_days = (b.end_date - b.start_date).days + 1

    context = {
        "bookingdata": bookingdata,
        "user": user,
        "today": date.today()
    }

    return render(request, 'book.html', context)


def booking_details(request, id):
    booking = get_object_or_404(Booking, id=id)

    if booking.user_id.id != request.session.get('userlogid'):
        return redirect('/bookinghistory')

    payment = Payment.objects.filter(booking_id=booking).first()
    days = max((booking.end_date - booking.start_date).days, 1)

    driver_fee = booking.total_driver_fee
    driver_fee_per_day = driver_fee / days

    context = {
        'booking': booking,
        'payment': payment,
        'driver_fee': driver_fee,
        'driver_fee_per_day': driver_fee_per_day,
    }

    return render(request, 'bookingdetails.html', context)


def cancel_booking(request, id):
    if 'userlogid' not in request.session:
        return redirect('/login')

    user_id = request.session['userlogid']
    booking = Booking.objects.get(id=id)

    if booking.user_id.id == user_id:

        booking.booking_status = False
        booking.ride_status = "cancelled"

        booking.save()

        vehicle = booking.vehicle_id
        vehicle.available_status = "1"
        vehicle.save()

        if booking.driver_id:
            driver = booking.driver_id
            driver.is_available = True
            driver.save()

    return redirect('/bookinghistory')


def download_booking_pdf(request, id):
    booking = get_object_or_404(Booking, id=id)

    if booking.user_id.id != request.session.get('userlogid'):
        return redirect('/bookinghistory')

    payment = Payment.objects.filter(booking_id=booking).first()
    template = get_template('bookingreceipt.html')
    driver_fee_per_day=800
    if booking.vehicle_id.vehicle_img:
        vehicle_img = request.build_absolute_uri(
            booking.vehicle_id.vehicle_img.url
        )
    else:
        vehicle_img = None

    html = template.render({
        'booking': booking,
        'payment': payment,
        'vehicle_img': vehicle_img,
        'driver_fee_per_day':driver_fee_per_day
    })

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="booking_{id}.pdf"'
    pisa.CreatePDF(html, dest=response)

    return response

def request_vehicle_return(request):
    if request.method != "POST":
        return redirect('leaser_cars')

    # 🔒 Session check
    if 'leaserlogid' not in request.session:
        messages.error(request, "Login required")
        return redirect('login')

    leaser_id = request.session['leaserlogid']
    vehicle_id = request.POST.get('vehicle_id')

    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
        leaser = Leaser.objects.get(id=leaser_id)
    except (Vehicle.DoesNotExist, Leaser.DoesNotExist):
        messages.error(request, "Invalid data")
        return redirect('leaser_cars')

    # 🚫 Prevent duplicate request
    existing = VehicleReturnRequest.objects.filter(
        vehicle_id=vehicle,
        leaser_id=leaser,
        status='pending'
    ).first()

    if existing:
        messages.warning(request, "Request already pending approval.")
        return redirect('leaser_cars')

    # 📌 Default booking
    booking = None

    # 🎯 Message + booking logic based on vehicle status
    if vehicle.available_status == '1':  # Available
        message = "Return request submitted while the vehicle is available."

    elif vehicle.available_status == '2':  # Not Available
        message = "Return request submitted while the vehicle is not available for booking."

    elif vehicle.available_status == '3':  # On Ride

        # ✅ Get latest active booking (IMPORTANT FIX)
        booking = Booking.objects.filter(
            vehicle_id=vehicle,
            ride_status='on_ride' or 'not_started',          # ✅ correct value (not "on_ride")
            booking_status=True       # optional but recommended
        ).first()

        # 🔍 Debug (you can remove later)
        print("BOOKING FOUND:", booking)

        if booking:
            message = "Return request submitted while the vehicle is on an active ride. Approval will be processed after ride completion."
        else:
            message = "Vehicle marked as on ride, but no active booking found."

    else:
        message = "Return request submitted."

    # 📝 Create request
    VehicleReturnRequest.objects.create(
        vehicle_id=vehicle,
        leaser_id=leaser,
        booking_id=booking,   # will store FK or NULL safely
        request_message=message
    )

    messages.success(
        request,
        "Request sent successfully. Please wait for admin approval."
    )

    return redirect('leaser_cars')

def update_ride_status(request, id):
    if request.method != "POST":
        return redirect('/assign_ride')

    assignment = get_object_or_404(Assign_Driver, id=id)
    booking = assignment.booking_id
    vehicle = booking.vehicle_id   # ✅ get vehicle
    driver = booking.driver_id

    new_status = request.POST.get("status")

    # 🚗 START RIDE
    if new_status == "on_ride" and booking.ride_status == "not_started":
        booking.ride_status = "on_ride"
        booking.save()

        # 🔥 UPDATE VEHICLE STATUS → ON RIDE
        vehicle.available_status = '3'
        vehicle.save()

        messages.success(request, "Ride started successfully 🚗")

    # ✅ END RIDE
    elif new_status == "completed" and booking.ride_status == "on_ride":
        booking.ride_status = "completed"
        booking.save()

        # 🔥 UPDATE VEHICLE STATUS → AVAILABLE
        vehicle.available_status = '1'
        vehicle.save()

        driver.is_available = True
        driver.save()

        messages.success(request, "Ride completed successfully ✅")

    else:
        messages.error(request, "Invalid action ❌")

    return redirect('/assign_ride')

def forgotpasswordpage(request):

    return render(request, "forgot_password.html")


def forgotpassword(request):
    if request.method == 'POST':
        email = request.POST.get('email')

        user = User.objects.filter(email=email).first()
        leaser = Leaser.objects.filter(email=email).first()
        driver = Driver.objects.filter(email=email).first()

        account = user or leaser or driver

        if account:
            otp = str(random.randint(100000, 999999))

            # Store in session
            request.session['reset_email'] = email
            request.session['reset_otp'] = otp

            msg = f"""
Hello from Rideplex 🚗

Your OTP for password reset is: {otp}
Do not share it with anyone.
"""

            send_mail(
                'Rideplex Password Reset OTP',
                msg,
                'rideplex.support@gmail.com',
                [email],
                fail_silently=False,
            )

            return redirect('/otpverification')

        else:
            messages.error(request, 'Email not registered')
            return redirect('/forgot_password')

    return render(request, "forgot_password.html")

def otp_verification(request):
    return render(request, "verify_otp.html")

def verify_otp(request):
    if request.method == 'POST':
        user_otp = request.POST.get('otp')
        session_otp = request.session.get('reset_otp')

        if user_otp == session_otp:
            return redirect('/reset_password')
        else:
            messages.error(request, 'Invalid OTP')
            return redirect('/otpverification')

    return render(request, "verify_otp.html")

def reset_password(request):
    if request.method == "POST":

        password = request.POST.get("password")
        confirm_password = request.POST.get("re-password")

        # ✅ Match check
        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('/reset_password')

        email = request.session.get("reset_email")

        # ✅ Session validation
        if not email:
            messages.error(request, "Session expired. Try again.")
            return redirect('/forgot_password')

        # ✅ Find account again
        user = User.objects.filter(email=email).first()
        leaser = Leaser.objects.filter(email=email).first()
        driver = Driver.objects.filter(email=email).first()

        account = user or leaser or driver

        if not account:
            messages.error(request, "Account not found")
            return redirect('/forgot_password')

        # ✅ Update password (NO HASH)
        account.password = password
        account.save(update_fields=['password'])

        # ✅ Clear session
        request.session.flush()

        messages.success(request, "Password updated successfully")
        return redirect("/login")

    return render(request, "reset_password.html")