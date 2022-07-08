$(function(){
    initTableUserList(); // initialize table
    refreshUserListTable();
});

function initTableUserList() {
    var $table = $('#table-user-list');

    $table.bootstrapTable('destroy').bootstrapTable({ 
        
    })
}

function refreshUserListTable() {
    var $table = $('#table-user-list')
    $(function() {
        $table.bootstrapTable('refresh', { 
            url: '/admin/users/table_list' 
        });
    });
}

function queryParamsUserTable(params) {
    return {
        search: $('#search-user').val(), 
        offset: params.offset, 
        limit: params.limit, 
        type: 1 // user_list
    };
}

function imageFormatter(value, row, index) { 
    return '<img width="50px" height="50px" class="user-image img-circle elevation-2" src="/storage/users/' + value + '" />';
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

// $('#br-add-brand').on('click', function(){
//     window.location.href = "/admin/brand/add_page";
// });

$('#table-user-list').on('click-cell.bs.table', function(field, value, row, $el) {
    var user_id = $el.user_id; 

    window.location.href = "/admin/users/edit_page/" + user_id;
});

$('#search-user').on('keyup', delay(function(e) { 
    refreshUserListTable();
}, 500)); 