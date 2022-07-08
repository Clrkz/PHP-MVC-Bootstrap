var dealer_status = 0;

$(function(){
    loadDealerDetails();
});

function loadDealerDetails(){
    var status = false;
    $.ajax({
        url: "/admin/dealers/dealer_load",
        data: {
            dealer_id: dealer_id, 
            csrf_token: $('#csrf_token').val() 
        },
        type: "POST",
        dataType: 'json',
        beforeSend: function() {
            
        },
        success: function(result) {
            $('#elid_dealer_code').val(result[0].code); 
            $('#elid_dealer_name').val(result[0].name); 
            parseInt(result[0].status) == 0 ? status = false : status = true; 
            $('#elid_dealer_status').prop('checked', status); 
            dealer_status = result[0].status; 

            $('#span-created-at').text(result[0].created_at); 
            $('#span-uploaded-by').text(result[0].updated_at); 
        }
    })
}

function back(){
    window.history.back();
}

$.validator.setDefaults({
    submitHandler: function(){
        var json_data = formJson('data-json', $("[data-json]"));

        $.ajax({
            url: "/admin/dealers/dealer_edit",
            data: {
                json_data: json_data, 
                csrf_token: $('#csrf_token').val(), 
                dealer_id: dealer_id,
                dealer_status: dealer_status
            },
            type: "POST",
            dataType: 'json',
            beforeSend: function() {
                toastr.remove();
                toastr.info("Updating..");
                $('#elid_save_dealer').prop('disabled', true);
            },
            success: function(result) { 
                if(parseInt(result.status) === 0) { // success 
                    toastr.remove();
                    toastr.success(result.message);

                    setTimeout(function() {
                        window.location.href = "/admin/dealers";
                    }, 2000);
                } 
                else if(parseInt(result.status) === 1){ // duplicate code 
                    toastr.remove();
                    toastr.error(result.message); 
                } 
                else if(parseInt(result.status) === 2){ // duplicate name 
                    toastr.remove();
                    toastr.error(result.message); 
                } 
                else if(parseInt(result.status) === 3){ // something wrong 
                    toastr.remove();
                    toastr.error(result.message); 
                }
                else if(parseInt(result.status) === 10){ // nothing changes 
                    toastr.remove();
                    toastr.info(result.message); 
                }

                $('#elid_save_dealer').prop('disabled', false);
            },
            error: function() {
                toastr.remove();
                toastr.error("Error has occurred. Try again.");

                $('#elid_save_dealer').prop('disabled', false);
            }
        });
    },
    ignore: [] 
});

$('#form-dealer').validate({ // elid -> means 'element id'
    rules: {
        elid_dealer_code: {
            required: true
        }, 
        elid_dealer_name: {
            required: true
        }
    },
    messages: {
        
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

$('#elid_dealer_status').on('change.bootstrapSwitch', function(e){
    if($(this).is(':checked')){
        dealer_status = 1;
    } 
    else {
        dealer_status = 0;
    }
});