$(function(){
    initTableDealerList(); // initialize table
    refreshDealerListTable();
});

function initTableDealerList() {
    var $table = $('#table-dealer-list');

    $table.bootstrapTable('destroy').bootstrapTable({ 
        
    })
}

function refreshDealerListTable() {
    var $table = $('#table-dealer-list')
    $(function() {
        $table.bootstrapTable('refresh', { 
            url: '/admin/dealers/table_list'
        });
    });
}

function queryParamsDealerTable(params) {
    return {
        search: $('#br-search-dealer').val(), 
        offset: params.offset, 
        limit: params.limit, 
        type: 1 // dealer_list
    };
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

$('#br-add-dealer').on('click', function(){
    window.location.href = "/admin/dealers/add_page";
});

$('#table-dealer-list').on('click-cell.bs.table', function(field, value, row, $el) {
    var dealer_id = $el.id; 

    window.location.href = "/admin/dealers/edit_page/" + dealer_id;
});

$('#br-add-brand').on('click', function(){
    window.location.href = "/admin/brands/add_page";
});

$('#table-brand-list').on('click-cell.bs.table', function(field, value, row, $el) {
    var brand_id = $el.id; 

    window.location.href = "/admin/brands/edit_page/" + brand_id;
});

$('#br-search-dealer').on('keyup', delay(function(e) { 
    refreshDealerListTable();
}, 500)); 