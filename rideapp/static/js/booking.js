
    // ===== BUTTON CONTROL LOGIC =====

document.getElementById("booking_type")
.addEventListener("change", function(){

    let type = this.value;

    let confirmBtn =
        document.getElementById("confirmBtn");

    let visitBtn =
        document.getElementById("visitProfileBtn");

    let uploaded =
        document.getElementById("licenseUploaded").value;

    let verified =
        document.getElementById("licenseVerified").value;

    // WITH DRIVER → Always Confirm
    if(type === "with_driver"){
        confirmBtn.style.display = "inline-block";
        visitBtn.style.display = "none";
    }

    // SELF DRIVE
    else if(type === "self_drive"){

        // If uploaded AND verified → Confirm
        if(uploaded === "true" && verified === "true"){
            confirmBtn.style.display = "inline-block";
            visitBtn.style.display = "none";
        }

        // If not uploaded OR not verified → Visit Profile
        else{
            confirmBtn.style.display = "none";
            visitBtn.style.display = "inline-block";
        }
    }

    else{
        confirmBtn.style.display = "none";
        visitBtn.style.display = "none";
    }

});


// ===== TOGGLE =====
document.getElementById("booking_type")
.addEventListener("change", function(){

 let type = this.value;

 let withDriver =document.getElementById("withDriverSection");

 let selfDrive =document.getElementById("selfDriveSection");

 let pickup =document.getElementById("pickup_location");

 let time =document.getElementById("pickup_time");

 let license =document.getElementById("license");




 if(type == "with_driver"){

   withDriver.style.display="block";
   selfDrive.style.display="none";

   pickup.setAttribute("required","true");
   time.setAttribute("required","true");

   license.removeAttribute("required");
   confirmBtn.style.display = "inline-block";
   visitBtn.style.display = "none";

 }
 else{

   withDriver.style.display="none";
   selfDrive.style.display="block";

   license.setAttribute("required","true");

   pickup.removeAttribute("required");
   time.removeAttribute("required");


        // If uploaded AND verified → Confirm
        if(uploaded === "true" && verified === "true"){
            confirmBtn.style.display = "inline-block";
            visitBtn.style.display = "none";
        }

        // If not uploaded OR not verified → Visit Profile
        else if(uploaded === "true" && verified === "false"){
            confirmBtn.style.display = "none";
            visitBtn.style.display = "inline-block";
        }
        else if(uploaded === "false")
        {
            confirmBtn.style.display = "none";
            visitBtn.style.display = "inline-block";
        }
        else
        {
        confirmBtn.style.display = "inline-block";
            visitBtn.style.display = "none";
        }
 }

});



// ===== START ≥ TODAY =====
window.Parsley.addValidator('mindate',{

 validateString:function(value){

   let today=new Date();
   today.setHours(0,0,0,0);

   let selected=new Date(value);

   return selected>=today;
 },

 messages:{en:"Start date must be today or future"}

});


// ===== END DATE >= START & TODAY =====
window.Parsley.addValidator('enddate', {

  validateString: function(value, startSelector){

    let today = new Date();
    today.setHours(0,0,0,0);

    let end = new Date(value);

    let startVal =
      document.querySelector(startSelector).value;

    if(!startVal) return false;

    let start = new Date(startVal);

    return end >= start && end >= today;
  },

  messages:{
    en: "End date must be after start date"
  }

});



// ===== PICKUP TIME +30 MIN =====
window.Parsley.addValidator('pickuptime',{

 validateString:function(value){

   let startDate=
   document.getElementById("start_date").value;

   if(!startDate)return false;

   let now=new Date();
   let selectedDate=new Date(startDate);

   if(selectedDate.toDateString()==
      now.toDateString()){

     let min=new Date(now.getTime()
             +30*60000);

     let[h,m]=value.split(":");

     let pickup=new Date();
     pickup.setHours(h,m,0);

     return pickup>=min;
   }

   return true;
 },

 messages:{
  en:"Pickup must be 30 min after booking time"
 }
});

document.addEventListener("DOMContentLoaded", function () {

    let startInput = document.getElementById("start_date");
    let endInput = document.getElementById("return_date");

    let today = new Date();

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // ✅ MIN = Today
    let todayFormatted = formatDate(today);
    startInput.min = todayFormatted;

    // ✅ MAX = Today + 14 days
    let maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);
    startInput.max = formatDate(maxDate);

    // ✅ Auto control END DATE based on START DATE
    startInput.addEventListener("change", function () {

        let selectedStart = new Date(this.value);

        // End date cannot be before start date
        endInput.min = formatDate(selectedStart);

        // Auto reset invalid end date
        if (endInput.value && new Date(endInput.value) < selectedStart) {
            endInput.value = "";
        }
    });

});