var Toast;
var attr_id = 0;
var attr_status = 0;

$(function(){
    navigateTabs(1);
    refreshAttributeList();

    Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    $('.el-items').prop('disabled', true); 
});

function navigateTabs(tab) {
    $('#tab-attributes').addClass('active');
    $('#tabpage-attributes').addClass('active');
    $('#tabpage-attributes').addClass('show'); 
}

function refreshAttributeList(){
    $.ajax({
        url: "/admin/attribute_list", 
        data: {
            csrf_token: $('#csrf_token').val()
        },
        type: "POST", 
        dataType: 'json', 
        success: function(result) { 
            $('#attribute-list').html('');
            $('#attribute-list').append("\"" + result + "\"");
        },
        error: function() {
            Toast.fire({
                icon: 'error',
                title: "There's something wrong fetching attribute list"
            }); 
        }
    });
}

$.validator.setDefaults({ 
    submitHandler: function(){
        var json_data = new Object();
        json_data.attribute_name = $('#new_attribute_name').val(); 
        var jason = JSON.stringify(json_data); 
        
        $.ajax({
            url: "/admin/attribute_add", 
            data: {
                json_data: jason, 
                csrf_token: $('#csrf_token').val()
            },
            type: "POST", 
            dataType: 'json', 
            success: function(result) { // console.log(result);
                if(parseInt(result.status) === 0) { // success
                    Toast.fire({
                        icon: 'success',
                        title: result.message
                    }); 

                    $('#new_attribute_name').val("");
                    $('#modal-add-attribute').modal('hide');

                    refreshAttributeList();
                } 
                else if(result.status == 1){ // duplicate
                    Toast.fire({
                        icon: 'warning',
                        title: result.message
                    }); 
                } 
            },
            error: function() {
                Toast.fire({
                    icon: 'error',
                    title: "Error has occurred, try again"
                }); 
            }
        });
    }
});

$('#form-add-attribute').validate({ 
    rules: {
        new_attribute_name: {
            required: true
        }
    },
    messages: {
        new_attribute_name: {
            required: "Please provide attribute name"
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

$('#attribute-list').on('change', function(){
    attr_id = $('#attribute-list').val();

    $.ajax({
        url: "/admin/attribute_fetch", 
        data: { 
            csrf_token: $('#csrf_token').val(), 
            attr_id: attr_id
        },
        type: "POST", 
        dataType: 'json', 
        success: function(result) { 
            $('#attr-name').val(result[0].title);
            $('#attr-added-by').text(result[0].createdAt);
            $('#attr-modify-by').text(result[0].updatedAt);

            $('.el-items').prop('disabled', false); 
            $('#attr-status').prop('checked', parseInt(result[0].status)); 
        },
        error: function() {
            Toast.fire({
                icon: 'error',
                title: "Error fetching data, try again"
            }); 
        }
    });
});

$('#attr-status').on('change', function(){
    if($(this).is(':checked')){
        attr_status = 1;
    } 
    else {
        attr_status = 0;
    }
});

$('#attr-update').on('click', function(){
    var attr_name = $('#attr-name').val(); 

    $.ajax({
        url: "/admin/attribute_update", 
        data: { 
            csrf_token: $('#csrf_token').val(), 
            attr_id: attr_id, 
            attr_name: attr_name, 
            attr_status: attr_status 
        },
        type: "POST", 
        dataType: 'json', 
        success: function(result) { 
            if(result.status == 0){ // success
                Toast.fire({
                    icon: 'success',
                    title: "Update success"
                }); 

                refreshAttributeList();
                // attr_id = 0;
            } 
            else if(result.status == 1){
                Toast.fire({
                    icon: 'warning',
                    title: "Duplicate entry"
                }); 
            } 
            else if(result.status == 10){
                Toast.fire({
                    icon: 'info',
                    title: "Nothing changed"
                }); 
            }
        },
        error: function() {
            Toast.fire({
                icon: 'error',
                title: "Error fetching data, try again"
            }); 
        }
    }); 
});