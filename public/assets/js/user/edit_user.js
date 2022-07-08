var user_status = 0;
var user_status = 0;

var form_data;
var image_extension = "";
var is_changed = 0;

// initializations
$('#user_ext_name').select2({
    placeholder: "Ext name",
    allowClear: false
});

$(function(){
    var promises = fillExtNameDropdown();

    $.when.apply($, promises).then(function(){
        loadUserDetails();
    })
});
    

function loadUserDetails(){
    var status = false;
    $.ajax({
        url: "/admin/users/user_load",
        data: {
            user_id: user_id
        },
        type: "GET",
        dataType: 'json',
        beforeSend: function() {
            
        },
        success: function(result) { // alert(result[0].extName); 
            $('#user_first_name').val(result[0].firstName); 
            $('#user_middle_name').val(result[0].middleName); 
            $('#user_last_name').val(result[0].lastName); 
            $('#user_ext_name').val(result[0].extName).trigger('change'); 
            $('#user_mobile_number').val(result[0].mobile); 
            $('#user_email').val(result[0].email); 
            $('#user_logo').attr('src', '/storage/users/' + result[0].profile);
            $('#user_role').val(result[0].roleId); 

            $('#user_status').prop('checked', result[0].status);
            user_status = result[0].status;
        }
    });
}

function fillExtNameDropdown(){
    $.ajax({
        url:"/admin/users/user_ext_dropdown", 
        type:"GET",
        data: {
            // type: 1 // fill ext_name dropdown
        },
        beforeSend: function(){

        },
        success: function(result){
            $('#user_ext_name').html('');
            $.each(result, function(index, value){
                $('#user_ext_name').append('<option value="' + result[index].id + '">' + result[index].name + '</option>"'); 
            });
        }
    });
}

function gotoTab($el_nav, $el_content) {
    $(".tab-wrapper li > a.active").removeClass("active"); 
    $(".tab-pane").removeClass("show").removeClass("active"); 
  
    $el_nav.addClass("active"); 
    $el_content.addClass("active").addClass("show"); 
}

$.validator.addMethod(
    "first_tab",
    function (value, element, param) {
        if(isEmpty(value)) {
            gotoTab($("#tab-user-profile"), $("#tabpage-user-profile"));
            return false;
        }
        return true;
    },
    "This field is required."
);

function triggerClick(e) { 
    document.querySelector('#file').click();
}

function displayImage(e) {
    is_changed = 1;
    if (e.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('#user_logo').setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(e.files[0]);
    }

    var property = document.getElementById("file").files[0];
    var image_name = property.name;
    image_extension = image_name.split('.').pop().toLowerCase();

    form_data = new FormData();
    form_data.append('file', property);
}

function generateId() { 
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } 
        else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function alphaNumeric(data){
    return data.replace(/\W/g, '');
}

function uploadImage(id){
    if(is_changed == 1){
        form_data.append('csrf_token', $('#csrf_token').val());
        form_data.append('img_id', id);
    } 
    else {
        form_data = new FormData();
        form_data.append('csrf_token', $('#csrf_token').val());
        form_data.append('img_id', id);
    }
    
    var photo_status = 0;

    $.ajax({
        url: '/admin/users/user_edit_image', 
        type: "POST", 
        data: form_data, 
        async:false,
        cache: false,
        contentType: false,
        processData: false,

        beforeSend: function(){

        },
        success: function(result){ // alert("Result " + result); 
            photo_status = result;
        }, 
        error: function(xhr, status, error){ 
            // alert("Error: " + xhr.responseText); 
        }
    });
    
    return photo_status;
}

function back(){
    window.history.back();
}

$.validator.setDefaults({
    submitHandler: function(){
        var uniqId = alphaNumeric(generateId());
        var stat = uploadImage(uniqId); // alert("stat: " + stat); return;
        var filename = "";

        if(stat == 0){
            filename = uniqId + "." + image_extension;
        } 
        else {
            filename = "Same";
        }

        var json_data = formJson('data-json', $("[data-json]")); // alert(filename); return;

        // alert(filename); return;

        $.ajax({
            url: "/admin/users/user_edit", 
            data: {
                json_data: json_data, 
                csrf_token: $('#csrf_token').val(), 
                user_id: user_id, 
                user_status: user_status, 
                image_filename: filename
            }, 
            type: "POST", 
            dataType: "json", 
            beforeSend: function(){

            }, 
            success: function(result){
                if(result.status == 0){ // success
                    toastr.remove();
                    toastr.success(result.message);
                } 
                else if(result.status == 1){ // duplicate mobile
                    toastr.remove();
                    toastr.error(result.message);
                } 
                else if(result.status == 2){ // duplicate email
                    toastr.remove();
                    toastr.error(result.message);
                } 
                else if(result.status == 3){ // update error
                    toastr.remove();
                    toastr.error(result.message);
                } 
                else if(result.status == 10){
                    toastr.remove();
                    toastr.info("Nothing changes");
                }
            }
        });
    }, 
    ignore: []
});

$('#form-user-update').validate({
    rules: {
        user_first_name: {
            first_tab: true,
        },

        user_last_name: {
            first_tab: true
        }, 

        user_mobile_number: {
            
        }, 

        user_email: {
            email: true
        }
    }, 
    messages: {
        user_first_name: {
            required: "First name is required" 
        }, 

        user_last_name: {
            required: "Last name is required" 
        }, 

        user_email: {
            email: "Please enter a valid email address"
        }
    }, 
    errorElement: 'span',
    errorPlacement: function(error, element) {
        error.addClass('invalid-feedback');
        element.closest('.form-group').append(error);
    },
    highlight: function(element, errorClass, validClass) {
        $(element).addClass('is-invalid');
    },
    unhighlight: function(element, errorClass, validClass) {
        $(element).removeClass('is-invalid');
    }
});

$('#user_status').on('change.bootstrapSwitch', function(e){
    if($(this).is(':checked')){
        user_status = 1;
    } 
    else {
        user_status = 0;
    }
});