var brand_status = 1;
var form_data;
var image_extension = "";
var is_changed = 0;

$(function(){
    $('#elid_brand_status').prop('checked', true);
});

function triggerClick(e) { 
    document.querySelector('#file').click();
}

function displayImage(e) {
    is_changed = 1;
    if (e.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('#brand_logo').setAttribute('src', e.target.result);
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
        } else {//Use microseconds since page-load if supported
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
    
    var status;

    $.ajax({
        url: '/admin/brands/brand_upload_image', 
        type: "POST", 
        data: form_data, 
        async: false, 
        cache: false,
        contentType: false,
        processData: false,

        beforeSend: function(){

        },
        success: function(result){
            status = result;
        }, 
        error: function(xhr, status, error){ 
            // alert("Error: " + xhr.responseText); 
        }
    });

    return status;
}

function back(){
    window.history.back();
}

$.validator.setDefaults({
    submitHandler: function(){
        var uniqId = alphaNumeric(generateId());
        var stat = uploadImage(uniqId);
        var filename = "";

        if(stat == 0){
            filename = uniqId + "." + image_extension;
        } 
        else {
            filename = "default_logo.png";
        }

        var json_data = formJson('data-json', $("[data-json]")); 
        // var jason = JSON.parse(json_data);
        // jason.date = "12/12/2020";
        // jason = JSON.stringify(jason);
        // alert(jason); return;
        
        $.ajax({
            url: "/admin/brands/brand_add", 
            data: {
                json_data: json_data, 
                csrf_token: $('#csrf_token').val(), 
                brand_status: brand_status, 
                image_filename: filename
            },
            type: "POST", 
            dataType: 'json', 
            beforeSend: function() {
                toastr.remove(); 
                toastr.info("Adding brand"); 
                $('#br-button-add').prop('disabled', true); 
            },
            success: function(result) {
                if(parseInt(result.status) === 0) {
                    toastr.remove(); 
                    toastr.success(result.message); 

                    setTimeout(function() {
                        window.location.href = "/admin/brands";
                    }, 2000);
                } 
                else { 
                    toastr.remove(); 
                    toastr.error(result.message); 
                } 

                $('#br-button-add').prop('disabled', false);
            },
            error: function() {
                toastr.remove();
                toastr.error("Error has occurred. Try again.");

                $('#br-button-add').prop('disabled', false);
            }
        });
    },
    ignore: [] 
});

$('#form-brand').validate({ // elid -> means 'element id'
    rules: {
        elid_brand_name: {
            required: true
        }
    },
    messages: {
        elid_brand_name: {
            required: "Brand name is required"
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

$('#elid_brand_status').on('change.bootstrapSwitch', function(e){
    if($(this).is(':checked')){
        brand_status = 1;
    } 
    else {
        brand_status = 0;
    }
});