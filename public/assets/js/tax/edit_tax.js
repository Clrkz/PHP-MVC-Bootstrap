var tax_status = 0;

$(function(){
    loadTaxDetails();
});

function loadTaxDetails(){
    var status = false;
    $.ajax({
        url: "/admin/tax/tax_load",
        data: {
            tax_id: tax_id
        },
        type: "GET",
        beforeSend: function() {
            
        },
        success: function(result) {
            $('#tax_name').val(result[0].name); 
            $('#tax_percentage').val(result[0].percentage);
            $('#tax_description').val(result[0].description);
            parseInt(result[0].status) == 0 ? status = false : status = true;
            $('#tax_status').prop('checked', status);
            tax_status = result[0].status;

            $('#span-created-at').text(result[0].created_at);
            $('#span-updated-at').text(result[0].updated_at);
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
            url: "/admin/tax/tax_edit",
            data: {
                json_data: json_data, 
                csrf_token: $('#csrf_token').val(), 
                tax_id: tax_id,
                tax_status: tax_status
            },
            type: "POST",
            dataType: 'json',
            beforeSend: function() {
                toastr.remove();
                toastr.info("Updating..");
                $('#button-update').prop('disabled', true);
            },
            success: function(result) { 
                if(parseInt(result.status) === 0) { // success
                    toastr.remove();
                    toastr.success(result.message);

                    setTimeout(function() {
                        window.location.href = "/admin/tax";
                    }, 2000);
                } 
                else if(parseInt(result.status) === 1){ // duplicate
                    toastr.remove();
                    toastr.error(result.message); 
                } 
                else if(parseInt(result.status) === 2){ // something wrong
                    toastr.remove();
                    toastr.error(result.message); 
                }
                else if(parseInt(result.status) === 10){ // nothing changes
                    toastr.remove();
                    toastr.info(result.message); 
                }

                $('#button-update').prop('disabled', false);
            },
            error: function() {
                toastr.remove();
                toastr.error("Error has occurred. Try again.");

                $('#button-update').prop('disabled', false);
            }
        });
    },
    ignore: [] 
});

$('#form-tax').validate({ 
    rules: {
        tax_name: {
            required: true
        }, 
        tax_percentage: {
            required: true
        }, 
        tax_description: {
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

$('#tax_status').on('change.bootstrapSwitch', function(e){
    if($(this).is(':checked')){
        tax_status = 1;
    } 
    else {
        tax_status = 0;
    }
});