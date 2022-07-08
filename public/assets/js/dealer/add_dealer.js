var dealer_status = 1;

$(function(){
    $('#elid_dealer_status').prop('checked', true);
});

function back(){
    window.history.back();
}

$.validator.setDefaults({
    submitHandler: function(){
        var json_data = formJson('data-json', $("[data-json]"));

        $.ajax({
            url: "/admin/dealers/dealer_add",
            data: {
                json_data: json_data, 
                csrf_token: $('#csrf_token').val(), 
                dealer_status: dealer_status
            },
            type: "POST",
            dataType: 'json',
            beforeSend: function() {
                toastr.remove();
                toastr.info("Adding dealer");
                $('#elid_submit_dealer').prop('disabled', true);
            },
            success: function(result) { 
                if(parseInt(result.status) === 0) {
                    toastr.remove();
                    toastr.success(result.message);

                    setTimeout(function() {
                        window.location.href = "/admin/dealers";
                    }, 2000);
                } 
                else { 
                    toastr.remove();
                    toastr.error(result.message);
                }

                $('#elid_submit_dealer').prop('disabled', false);
            },
            error: function() {
                toastr.remove();
                toastr.error("Error has occurred. Try again.");

                $('#elid_submit_dealer').prop('disabled', false);
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
        elid_dealer_code: {
            required: "Dealer code is required"
        },
        elid_dealer_name: {
            required: "Dealer name is required"
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

$('#elid_dealer_status').on('change.bootstrapSwitch', function(e){
    if($(this).is(':checked')){
        dealer_status = 1;
    } 
    else {
        dealer_status = 0;
    }
});