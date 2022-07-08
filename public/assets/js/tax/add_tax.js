var tax_status = 1;
var form_data;
var image_extension = "";
var is_changed = 0;

$(function(){ 
    $('#tax_status').prop('checked', true);
});

function back(){
    window.history.back();
}

$.validator.setDefaults({
    submitHandler: function(){
        var json_data = formJson('data-json', $("[data-json]")); 
        
        $.ajax({
            url: "/admin/tax/tax_add", 
            data: {
                json_data: json_data, 
                csrf_token: $('#csrf_token').val(), 
                tax_status: tax_status
            },
            type: "POST", 
            dataType: 'json', 
            beforeSend: function() {
                toastr.remove(); 
                toastr.info("Adding tax"); 
                $('#tax-create').prop('disabled', true); 
            },
            success: function(result) {
                if(parseInt(result.status) === 0) {
                    toastr.remove(); 
                    toastr.success(result.message); 

                    setTimeout(function() {
                        window.location.href = "/admin/tax";
                    }, 2000);
                } 
                else if(parseInt(result.status === 1)) { 
                    toastr.remove(); 
                    toastr.warning(result.message); 
                } 
                else if(parseInt(result.status === 2)){
                    toastr.remove();
                    toastr.error(result.message);
                }

                $('#tax-create').prop('disabled', false);
            },
            error: function() {
                toastr.remove();
                toastr.error("Error has occurred. Try again.");

                $('#tax-create').prop('disabled', false);
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