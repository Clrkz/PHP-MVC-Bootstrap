//Only const Variable Here
(function () {
    "use strict";
    
    var selected_prod_loc_id = null; 
    var shown = true; 

    var container = $("#btn-add"); 
    var js_tree_disabled = 0;

    var btn_submit_state = ""; 
    var btn_add_state = "level one"; 
    var type = "wh"; 

    $(document).mouseup(function(e) { 
        if(!container.is(e.target) && container.has(e.target).length === 0) { 
            container.hideBalloon(); 
            shown = !shown; 
        }
    }); 

    function readProdLocData() { 
        $.ajax({ 
            url: "/admin/prod_location/data", 
            data: { 
                id: selected_prod_loc_id, 
            },
            type: "GET",
            dataType: "json",
            beforeSend: function() {
                $('#btn_add').attr('disabled', true); 
            },
            success: function (result) { 
                if(result.type == "wh" || result.type == "WH"){
                    btn_add_state = "level one"; 
                } 
                else if(result.type == "floor" || result.type == "FLOOR"){ 
                    btn_add_state = "level two"; 
                } 
                else if(result.type == "rack" || result.type == "RACK"){
                    btn_add_state = "level three"; 
                } 
                else if(result.type == "bin" || result.type == "BIN"){ 
                    btn_add_state = "level four"; 
                }
                type = result.type; 

                $('#btn_add').attr('disabled', false); 
                $('#title_name').val(result.title); 
                $('#location_active').val(result.status); 
                $('#location_active').prop('checked', parseInt(result.active)); 
            }, 
            error: function () { 
                toast('error', "Error has occurred. Try again"); 
            }, 
        }); 
    } 

    function updateProdLocTree(data) {
        var v = $('#prod_loc_tree').jstree(true).get_json('#', { 
            flat: true, 
        }).reduce(function (e, t) { 
            return e.concat({ 
                id: t.id, 
                parent_id: '#' === t.parent ? null : t.parent, 
                position: t.data.position, 
            }); 
        }, 
        []); 
    } 

    function backToView(){
        $('.add-operation').attr('disabled', false); 
        $('#container-field').removeClass('card-success'); 
        $('#tab-general').text("General"); 
        $('#btn_submit').removeClass('btn-success').val("Update"); 
        $('#btn_cancel').attr('hidden', true); 
        $('#btn_submit').attr('disabled', false); 

        // animation only
        $('#container-field').hide(); $('#container-field').fadeIn(); $('#container-field').show(); 
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

    $(function() {
        $('#prod_loc_tree').bind('select_node.jstree', function (evt, data) {
            // console.log('select!');
        }); 

        $('#btn-add').on("click", function() { 
            shown ? $(this).hideBalloon() : $(this).showBalloon();
            shown = !shown; 

            if(selected_prod_loc_id == null){ 
                container.showBalloon({ 
                    position: 'bottom', 
                    html: true, 
                    css: { 
                        color: 'black' 
                    }, 
                    contents: 
                        `
                            <div class="">
                                <div class="col-sm-4 p-1">
                                    <input style="width: 120px !important;" type="button" id="add-warehouse" class="btn btn-primary btn-sm" value="Warehouse"></input>
                                </div>
                            </div>
                        `, 
                    showAnimation: function(d, c) {
                        this.slideDown(d, c); 
                    }, 
                    hideAnimation: function(d, c) { 
                        this.slideUp(d, c); 
                    } 
                }); 
            } 
            else { 
                if(btn_add_state == "level one"){
                    container.showBalloon({ 
                        position: 'bottom', 
                        html: true, 
                        css: { 
                            color: 'black' 
                        }, 
                        contents: 
                            `
                                <div class="">
                                    <div class="col-sm-4 p-1">
                                        <input style="width: 120px !important;" type="button" id="add-warehouse" class="btn btn-primary btn-sm" value="Warehouse"></input>
                                    </div>
                                    <div class="col-sm-4 p-1">
                                        <input style="width: 120px !important;" type="button" id="add-floor" class="btn btn-primary btn-sm" value="Floor"></input>
                                    </div>
                                </div>
                            `, 
                        showAnimation: function(d, c) { 
                            this.slideDown(d, c); 
                        }, 
                        hideAnimation: function(d, c) { 
                            this.slideUp(d, c); 
                        } 
                    }); 
                } 
                else if(btn_add_state == "level two"){
                    container.showBalloon({ 
                        position: 'bottom', 
                        html: true, 
                        css: { 
                            color: 'black' 
                        }, 
                        contents: 
                            `
                                <div class="">
                                    <div class="col-sm-4 p-1">
                                        <input style="width: 120px !important;" type="button" id="add-rack" class="btn btn-primary btn-sm" value="Rack"></input>
                                    </div>
                                </div>
                            `, 
                        showAnimation: function(d, c) {
                            this.slideDown(d, c);
                        }, 
                        hideAnimation: function(d, c) { 
                            this.slideUp(d, c); 
                        }
                    }); 
                } 
                else if(btn_add_state == "level three"){
                    container.showBalloon({
                        position: 'bottom', 
                        html: true, 
                        css: {
                            color: 'black' 
                        }, 
                        contents: 
                            `
                                <div class="">
                                    <div class="col-sm-4 p-1">
                                        <input style="width: 120px !important;" type="button" id="add-bin" class="btn btn-primary btn-sm" value="Bin"></input>
                                    </div>
                                </div>
                            `, 
                        showAnimation: function(d, c) {
                            this.slideDown(d, c); 
                        }, 
                        hideAnimation: function(d, c) { 
                            this.slideUp(d, c); 
                        }
                    }); 
                } 
                else if(btn_add_state == "level four"){ 
                    container.showBalloon({
                        position: 'bottom',
                        html: true,
                        css: {
                            color: 'black'
                        },
                        contents: 
                            `
                                <div class="">
                                    <div class="col-sm-4 p-1">
                                        <input style="width: 120px !important;" type="button" id="add-bin" class="btn btn-primary btn-sm" value="Bin"></input> 
                                    </div>
                                </div>
                            `, 
                        showAnimation: function(d, c) {
                            this.slideDown(d, c);
                        }, 
                        hideAnimation: function(d, c) { 
                            this.slideUp(d, c); 
                        } 
                    }); 
                }
            } 

            // these scripts are enabled only after button click 
            $('#add-warehouse').on('click', function() { 
                $('#prod_loc_tree > ul > li').each(function() { 
                    disable(this.id); 
                }); 

                js_tree_disabled = 1; 
                btn_submit_state = "add"; 
                type = "wh"; 

                $('#title_name').val(""); 
                $('.add-operation').attr('disabled', true); 
                $('#container-field').toggleClass('card-success'); 
                $('#tab-general').text("Add warehouse"); 
                $('#btn_submit').toggleClass('btn-success').val("Add").attr('hidden', false); 
                $('#btn_cancel').attr('hidden', false); 

                // animation only
                $('#container-field').hide(); $('#container-field').fadeIn(); $('#container-field').show(); 
            }); 

            $('#add-floor').on('click', function() { 
                $('#prod_loc_tree > ul > li').each(function() { 
                    disable(this.id); 
                }); 

                js_tree_disabled = 1; 
                btn_submit_state = "add"; 
                type = "floor"; 

                $('#title_name').val(""); 
                $('.add-operation').attr('disabled', true); 
                $('#container-field').toggleClass('card-success'); 
                $('#tab-general').text("Add floor"); 
                $('#btn_submit').toggleClass('btn-success').val("Add").attr('hidden', false); 
                $('#btn_cancel').attr('hidden', false); 

                // animation only
                $('#container-field').hide(); $('#container-field').fadeIn(); $('#container-field').show(); 
            }); 

            $('#add-rack').on('click', function() { 
                $('#prod_loc_tree > ul > li').each( function() { 
                    disable(this.id);
                }); 

                js_tree_disabled = 1; 
                btn_submit_state = "add"; 
                type = "rack"; 

                $('#title_name').val(""); 
                $('.add-operation').attr('disabled', true); 
                $('#container-field').toggleClass('card-success'); 
                $('#tab-general').text("Add rack"); 
                $('#btn_submit').toggleClass('btn-success').val("Add").attr('hidden', false); 
                $('#btn_cancel').attr('hidden', false); 

                // animation only
                $('#container-field').hide(); $('#container-field').fadeIn(); $('#container-field').show(); 
            }); 
        
            $('#add-bin').on('click', function() {
                $('#prod_loc_tree > ul > li').each(function() {
                    disable(this.id); 
                }); 

                js_tree_disabled = 1; 
                btn_submit_state = "add"; 
                type = "bin"; 

                $('#title_name').val(""); 
                $('.add-operation').attr('disabled', true); 
                $('#container-field').toggleClass('card-success'); 
                $('#tab-general').text("Add bin"); 
                $('#btn_submit').toggleClass('btn-success').val("Add").attr('hidden', false); 
                $('#btn_cancel').attr('hidden', false); 

                // animation only
                $('#container-field').hide(); $('#container-field').fadeIn(); $('#container-field').show(); 
            }); 

            // these functions are enabled only after button is clicked
            function disable(node_id) {
                var node = $('#prod_loc_tree').jstree().get_node( node_id ); 
                $('#prod_loc_tree').jstree().disable_node(node); 

                node.children.forEach(function(child_id) {            
                    disable(child_id); 
                }); 
            } 

            function enable(node_id) {
                var node = $('#prod_loc_tree').jstree().get_node( node_id ); 
                $('#prod_loc_tree').jstree().enable_node(node); 

                node.children.forEach( function(child_id) {            
                    enable(child_id); 
                }); 
            }

            $('#btn_cancel').on('click', function() {
                $('#prod_loc_tree > ul > li').each(function() { 
                    enable(this.id); 
                }); 
        
                js_tree_disabled = 0; 
                btn_submit_state = ""; 
        
                $('.add-operation').attr('disabled', false); 
                $('#container-field').removeClass('card-success'); 
                $('#tab-general').text("General"); 
                $('#btn_submit').removeClass('btn-success').val("").attr('hidden', true); 
                $('#btn_cancel').attr('hidden', true); 

                if(selected_prod_loc_id != null){ 
                    // alert(selected_prod_loc_id); 
                    readProdLocData(); 
                }
        
                // animation purpose only
                $('#container-field').hide(); $('#container-field').fadeIn(); $('#container-field').show();
            }); 
        }); 
        
        container.hideBalloon(); 
        shown = !shown; 
    }); 

    $('#prod_loc_tree').jstree({ 
        core: {
            data: {
                url: "/admin/prod_location/list", 
                dataType: "json", 
            },
            check_callback: !0, 
        },
        plugins: ['dnd'], 
    }).on('move_node.jstree', function (e, data) {
        updateProdLocTree(data); 
        console.log(data); 
    });

    $('#collapse-all').on('click',function() {
        alert("On going function");
    });

    $('#expand-all').on('click',function() {
        alert("On going function");
    }); 

    $('#location_active').on('change', function() {
        if ($(this).is(":checked")) {
            $(this).val("1");
        } 
        else {
            $(this).val("0");
        }
        // alert($('#location_active').val()); 
    }); 

    $("#prod_loc_tree").on("click", ".jstree-anchor", function(e) {
        if(js_tree_disabled == 0){
            selected_prod_loc_id = $("#prod_loc_tree").jstree(true).get_node($(this)).id; 
            $('#btn_submit').removeClass('btn-success').val('Update').attr('hidden', false); 
            btn_submit_state = "update"; 

            readProdLocData(); 
        }
    }); 

    $('#prodLocForm').validate({
        rules: {
            title_name: {
                required: true
            },
        },
        messages: {
            title_name: "This field is required"
        },
        errorElement: "span", 
        errorPlacement: function (error, element) { 
            error.addClass("invalid-feedback"); 
            element.closest(".form-group").append(error); 
        }, 
        highlight: function (element, errorClass, validClass) { 
            $(element).addClass("is-invalid"); 
        }, 
        unhighlight: function (element, errorClass, validClass) { 
            $(element).removeClass("is-invalid"); 
        }, 

        submitHandler: function() { 
            var json_data = formJson('data-json', $('[data-json]')); // alert($('#location_active').val()); 

            if(btn_submit_state == "add") {
                var is_success = 0; 
                var added = "";
                var parent_id = null; 

                if(type != "wh" || type != "WH"){ 
                    parent_id = selected_prod_loc_id 
                }

                $.ajax({
                    url: "/admin/prod_location/add", 
                    data:{
                        json_data: json_data, 
                        type: type, 
                        parent_id: parent_id, 
                        active: $('#location_active').val(), 
                        csrf_token: csrf_token 
                    }, 
                    type: 'POST', 
                    dataType: 'json', 
                    beforeSend: function() {
                        $('#btn_submit').attr('disabled', true); 
                    }, 
                    success: function(result) { 
                        if(result > 0){
                            toast('success', "Added successfully"); 
                            $('#prod_loc_tree').jstree('refresh'); 
                            added = result;
                            is_success = 1; 

                            js_tree_disabled = 0; 
                            btn_submit_state = "update"; 

                            backToView(); 
                        } 
                        else if(result == 1){
                            toast('warning', "Title name is already in use in this level"); 
                        } 
                        else {
                            toast('error', "There's something wrong in adding " + type); 
                        }
                    }
                });

                setTimeout(function() { 
                    if(is_success == 1){
                        $('#prod_loc_tree').jstree('deselect_node', '#' + selected_prod_loc_id); 
                        selected_prod_loc_id = added; 
                        $('#prod_loc_tree').jstree('select_node', '#' + selected_prod_loc_id); 
                    } 
                }, 1000); 
            } 
            else if(btn_submit_state == "update") { 
                $.ajax({ 
                    url: "/admin/prod_location/update", 
                    data: { 
                        id: selected_prod_loc_id, 
                        type: type, 
                        json_data: json_data, 
                        active: $('#location_active').val(), 
                        csrf_token: csrf_token 
                    }, 
                    type: 'POST', 
                    dataType: 'json', 
                    beforeSend: function() {
                        $('#btn_submit').attr('disabled', true); 
                    }, 
                    success: function(result) { // alert(result.status); return; 
                        if(result.status == 0) {
                            toast('success', "Updated successfully"); 
                            $('#prod_loc_tree').jstree('refresh'); 
                        } 
                        else if(result.status == 1){
                            toast('warning', "Title name is already in use in this level"); 
                        } 
                        else if(result.status == 2){
                            toast('error', "There's something wrong in updating"); 
                        } 
                        else if(result.status == 10){
                            toast('info', "Nothing changes"); 
                        } 
        
                        $('#btn_submit').attr('disabled', false);
                    }, 
                    error: function() {
                        $('#btn_submit').attr('disabled', false);
                    }, 
                }); 
            } 
        }, 
        ignore: [], 
    }); 

    // $('#prod_loc_tree').bind(
    //     'select_node.jstree', function (evt, data) {
    //     // console.log('select!');
    // }); 
})(); 
