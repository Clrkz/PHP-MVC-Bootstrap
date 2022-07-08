$(function(){
    initTableBrandList(); // initialize table
    refreshBrandListTable();
});

function initTableBrandList() {
    var $table = $('#table-brand-list');

    $table.bootstrapTable('destroy').bootstrapTable({ 
        
    })
}

function refreshBrandListTable() {
    var $table = $('#table-brand-list')
    $(function() {
        $table.bootstrapTable('refresh', { 
            url: '/admin/brands/table_list'
        });
    });
}

function queryParamsBrandTable(params) {
    return {
        search: $('#br-search-brand').val(),
        offset: params.offset, 
        limit: params.limit, 
        type: 1 // brand_list
    };
}

function imageFormatter(value, row, index) { 
    return '<img width="50px" height="50px" class="user-image img-circle elevation-2" src="/storage/brands/' + value + 
        '" />';
}

function delay(callback, ms) {
    var timer = 0;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            callback.apply(context, args);
        }, ms || 0);
    };
}

$('#br-add-brand').on('click', function(){
    window.location.href = "/admin/brands/add_page";
});

$('#table-brand-list').on('click-cell.bs.table', function(field, value, row, $el) {
    var brand_id = $el.id; 

    window.location.href = "/admin/brands/edit_page/" + brand_id;
});

$('#br-search-brand').on('keyup', delay(function(e) { 
    refreshBrandListTable();
}, 500)); 