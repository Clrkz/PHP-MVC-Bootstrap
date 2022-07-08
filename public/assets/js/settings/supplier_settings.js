var selected_supplier = "";

$(function(){
    fillSupplierDropdown();

    $("input[data-bootstrap-switch]").each(function(){
        $(this).bootstrapSwitch('state', $(this).prop('checked'));
    });
    $('#supp-supplier-status-checkbox').bootstrapSwitch('disabled', true);
    $('#supp-update-supplier').attr('disabled', true);
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

function fillSupplierDropdown(){
    $.ajax({
        url:"/admin/supplier_op", 
        type:"GET",
        data: {
            type: 1 // fill supplier dropdown
        },
        beforeSend: function(){

        },
        success: function(result){
            $('#supp-supplier-list').html('');
            $.each(result, function(index, value){
                $('#supp-supplier-list').append('<option value="' + result[index].id + '">' + result[index].name + '</option>"');
            });
        }
    });
}

function loadSupplierDetails(){
    $.ajax({
        url:"/admin/supplier_op", 
        type:"GET",
        data: {
            type: 2, // load when dropdown clicked
            supplier_id: selected_supplier
        },
        beforeSend: function(){

        },
        success: function(result){ 
            $('#supp-supplier-code').val(result[0].code);
            $('#supp-supplier-name').val(result[0].name);
            $('#supp-span-supplier-added-by').text(result[0].added_by);
            $('#supp-span-date-added').text(result[0].date_added);
            $('#supp-span-last-modified-by').text(result[0].modified_by + " (" + result[0].date_modified + ")");
 
            var status = result[0].status == 0 ? false : true;
            $('#supp-supplier-status-checkbox').bootstrapSwitch('state', status);
        }
    });
}

$('#supp-supplier-list').on('change', function(){
    selected_supplier = $('#supp-supplier-list').val();

    $('#supp-supplier-status-checkbox').bootstrapSwitch('disabled', false);
    $('#supp-update-supplier').attr('disabled', false);

    loadSupplierDetails();
});

$('#supp-update-supplier').on('click', function(){ 
    var new_supplier_code = $('#supp-supplier-code').val();
    var new_supplier_name = $('#supp-supplier-name').val();
    var new_status = "";
    if($('#supp-supplier-status-checkbox').bootstrapSwitch('state')){ new_status = 1; } else { new_status = 0; }

    // requirements
    if(selected_supplier == ""){
        toastr.remove();
        toastr.warning("Please select supplier to be modified", "Unselected");

        return;
    }

    if(new_supplier_code == ""){
        toastr.remove();
        toastr.error("It seems supplier code is empty", "Incomplete data");

        return;
    }

    if(new_supplier_name == ""){
        toastr.remove();
        toastr.error("It seems supplier name is empty", "Incomplete data");

        return;
    }
    
    $.ajax({
        url:"/admin/supplier_op", 
        type:"GET",
        data: {
            type: 3, // update supplier
            supplier_id: selected_supplier, 
            supplier_code: new_supplier_code, 
            supplier_name: new_supplier_name, 
            status: new_status
        },
        beforeSend: function(){ 

        },
        success: function(result){
            if(result.status == 0){ // success
                toastr.remove();
                toastr.success("Supplier details updated", "Success");

                fillSupplierDropdown();
                loadSupplierDetails();

                return;
            } 
            else if(result.status == 1){ // duplicate code
                toastr.remove();
                toastr.error("Supplier code provided is already in use", "Duplicate");

                return;
            } 
            else if(result.status == 2){ // duplicate name
                toastr.remove();
                toastr.error("Supplier name provided is already in use", "Duplicate");

                return;
            } 
            else if(result.status == 3){ // update failed
                toastr.remove();
                toastr.error("There's a problem in updating supplier's details", "Error");

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

$('#supp-submit-supplier').on('click', function(){
    var new_supplier_code = $('#supp-new-supplier-code').val();
    var new_supplier_name = $('#supp-new-supplier-name').val();

    if(new_supplier_code == ""){
        toastr.remove();
        toastr.error("Supplier code cannot be left blank", "Incomplete");

        return;
    }

    if(new_supplier_name == ""){
        toastr.remove();
        toastr.error("Supplier name cannot be left blank", "Incomplete");

        return;
    }

    $.ajax({
        url:"/admin/supplier_op", 
        type:"GET",
        data: {
            type: 4, // add supplier
            supplier_code: new_supplier_code, 
            supplier_name: new_supplier_name
        },
        beforeSend: function(){ 

        },
        success: function(result){
            if(result.status == 0){
                toastr.remove();
                toastr.success("Supplier details added", "Success");

                $('.supp-el-modal-add').val("");
                $('#modal-supp-add-supplier').modal('hide');

                $('#supp-supplier-code').val("");
                $('#supp-supplier-name').val("");
                $('#supp-span-supplier-added-by').text("");
                $('#supp-span-date-added').text("");
                $('#supp-span-last-modified-by').text("");
                $('#supp-supplier-status-checkbox').bootstrapSwitch('disabled', true);
                $('#supp-update-supplier').attr('disabled', true);

                fillSupplierDropdown();

                return;
            } 
            else if(result.status == 1) {
                toastr.remove();
                toastr.error("Code / name is already in use", "Duplicate");

                return;
            } 
            else if(result.status == 2) {
                toastr.remove();
                toastr.error("There's a problem adding supplier", "Error");

                return;
            }
        }
    });
});

$('#supp-search-supplier').on('keyup', delay(function (e){
    var search_supplier = $('#supp-search-supplier').val();
    selected_supplier = "";

    $('#supp-supplier-code').val("");
    $('#supp-supplier-name').val("");
    $('#supp-span-supplier-added-by').text("");
    $('#supp-span-date-added').text("");
    $('#supp-span-last-modified-by').text("");
    $('#supp-supplier-status-checkbox').bootstrapSwitch('disabled', true);
    $('#supp-update-supplier').attr('disabled', true);

    $.ajax({
        url:"/admin/supplier_op",  
        type:"GET", 
        data: {
            type: 5, // search supplier
            search_item: search_supplier 
        },
        beforeSend: function(){

        },
        success: function(result){
            $('#supp-supplier-list').html('');
            $.each(result, function(index, value){
                $('#supp-supplier-list').append('<option value="' + result[index].id + '">' + result[index].name + '</option>"');
            });
        }
    });
}, 500));

$('#prod-add-product').on('click', function(){
    window.location.href = "/admin/catalog/create"; 
});