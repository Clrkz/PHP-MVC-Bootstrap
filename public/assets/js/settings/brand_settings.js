var selected_brand = "";

$(function(){
    fillBrandDropdown();

    $("input[data-bootstrap-switch]").each(function(){
        $(this).bootstrapSwitch('state', $(this).prop('checked'));
    });
    $('#br-brand-status-checkbox').bootstrapSwitch('disabled', true);
    $('#br-update-brand').attr('disabled', true);
});

function delay(callback, ms) {
    var timer = 0;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

function fillBrandDropdown(){
    $.ajax({
        url:"/admin/brand_op", 
        type:"GET",
        data: {
            type: 1 // fill brand dropdown
        },
        beforeSend: function(){

        },
        success: function(result){
            $('#br-brand-list').html('');
            $.each(result, function(index, value){
                $('#br-brand-list').append('<option value="' + result[index].id + '">' + result[index].name + '</option>"');
            });
        }
    });
}

function loadBrandDetails(){
    $.ajax({
        url:"/admin/brand_op", 
        type:"GET",
        data: {
            type: 2, // load when dropdown clicked
            brand_id: selected_brand 
        },
        beforeSend: function(){

        },
        success: function(result){ 
            $('#br-brand-name').val(result[0].name);
            $('#br-span-brand-added-by').text(result[0].added_by);
            $('#br-span-date-added').text(result[0].date_added);
            $('#br-span-last-modified-by').text(result[0].modified_by + " (" + result[0].date_modified + ")");
 
            var status = result[0].status == 0 ? false : true;
            $('#br-brand-status-checkbox').bootstrapSwitch('state', status);
        }
    });
}

$('#br-brand-list').on('change', function(){
    selected_brand = $('#br-brand-list').val();

    $('#br-brand-status-checkbox').bootstrapSwitch('disabled', false);
    $('#br-update-brand').attr('disabled', false);

    loadBrandDetails();
});

$('#br-update-brand').on('click', function(){ 
    var new_brand_name = $('#br-brand-name').val();
    var new_status = "";
    if($('#br-brand-status-checkbox').bootstrapSwitch('state')){ new_status = 1; } else { new_status = 0; }

    // requirements
    if(selected_brand == ""){
        toastr.remove();
        toastr.warning("Please select brand to be modified", "No selected item");

        return;
    }

    if(new_brand_name == ""){
        toastr.remove();
        toastr.error("It seems brand name is empty", "Incomplete data");

        return;
    }
    
    $.ajax({
        url:"/admin/brand_op", 
        type:"GET",
        data: {
            type: 3, // update brand
            brand_id: selected_brand, 
            brand_name: new_brand_name, 
            status: new_status
        },
        beforeSend: function(){ 

        },
        success: function(result){
            if(result.status == 0){ // success
                toastr.remove();
                toastr.success("Brand details updated", "Success");

                fillBrandDropdown();
                loadBrandDetails();

                return;
            } 
            else if(result.status == 1){ // duplicate name
                toastr.remove();
                toastr.error("Brand name provided is already in use", "Duplicate");

                return;
            } 
            else if(result.status == 2){ // update failed
                toastr.remove();
                toastr.error("There's a problem in updating brand's details", "Error");

                return;
            }
            else if(result.status == 10){ // nothing changes
                toastr.remove();
                toastr.success("Nothing changes", "");

                return;
            }
        }
    });
});

$('#br-submit-brand').on('click', function(){
    var new_brand_name = $('#br-new-brand-name').val();

    if(new_brand_name == ""){
        toastr.remove();
        toastr.error("Brand name cannot be left blank", "Incomplete");

        return;
    }

    $.ajax({
        url:"/admin/brand_op", 
        type:"GET",
        data: {
            type: 4, // add brand
            brand_name: new_brand_name
        },
        beforeSend: function(){ 

        },
        success: function(result){
            if(result.status == 0){
                toastr.remove();
                toastr.success("Brand details added", "Success");

                $('.br-el-modal-add').val("");
                $('#modal-br-add-brand').modal('hide');

                $('#br-brand-name').val("");
                $('#br-span-brand-added-by').text("");
                $('#br-span-date-added').text("");
                $('#br-span-last-modified-by').text("");
                $('#br-brand-status-checkbox').bootstrapSwitch('disabled', true);
                $('#br-update-brand').attr('disabled', true);

                fillBrandDropdown();

                return;
            } 
            else if(result.status == 1) {
                toastr.remove();
                toastr.error("Brand name is already in use", "Duplicate");

                return;
            } 
            else if(result.status == 2) {
                toastr.remove();
                toastr.error("There's a problem adding brand", "Error");

                return;
            }
        }
    });
});

$('#br-search-brand').on('keyup', delay(function (e){
    var search_brand = $('#br-search-brand').val();
    selected_brand = "";

    $('#br-brand-name').val("");
    $('#br-span-brand-added-by').text("");
    $('#br-span-date-added').text("");
    $('#br-span-last-modified-by').text("");
    $('#br-brand-status-checkbox').bootstrapSwitch('disabled', true);
    $('#br-update-brand').attr('disabled', true);

    $.ajax({
        url:"/admin/brand_op",  
        type:"GET", 
        data: {
            type: 5, // search brand
            search_item: search_brand  
        },
        beforeSend: function(){

        },
        success: function(result){
            $('#br-brand-list').html('');
            $.each(result, function(index, value){
                $('#br-brand-list').append('<option value="' + result[index].id + '">' + result[index].name + '</option>"');
            });
        }
    });
}, 500));