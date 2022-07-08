$(function(){
    initTableTaxList();
    refreshTaxListTable();
});

function initTableTaxList() {
    var $table = $('#table-tax-list');

    $table.bootstrapTable('destroy').bootstrapTable({ 
        
    });
}

function refreshTaxListTable() {
    var $table = $('#table-tax-list')
    $(function() {
        $table.bootstrapTable('refresh', { 
            url: '/admin/tax/table_list'
        });
    });
}

function queryParamsTaxTable(params) {
    return {
        search: $('#search-tax').val(), 
        offset: params.offset, 
        limit: params.limit
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

$('#button-create-tax').on('click', function(){
    window.location.href = "/admin/tax/create";
});

$('#table-tax-list').on('click-cell.bs.table', function(field, value, row, $el) {
    var tax_id = $el.id; 

    window.location.href = "/admin/tax/edit_page/" + tax_id; 
});

$('#search-tax').on('keyup', delay(function(e) { 
    refreshTaxListTable();
}, 500)); 