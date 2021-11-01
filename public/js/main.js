$(function () {

    // ========================================================================= //
    //    Add remove class active has menu
    // ========================================================================= //

    jQuery(".has-submenu").click(function () {
        jQuery(".has-submenu").removeClass("active");
        $(this).toggleClass("active");
    });

    // ========================================================================= //
    //    Toggle Aside Menu
    // ========================================================================= //

    jQuery(".hamburger").click(function () {
        jQuery("aside.left-panel").toggleClass("collapsed");
        jQuery("body").toggleClass("sidebar-toggled");
        jQuery("#main-wrapper").toggleClass("menu-toggle");
    });

    // ========================================================================= //
    //    Set attibute isnide body
    // ========================================================================= //

    jQuery('body').attr({
        'data-typography': "rubik",
        'data-sidebar-style': "full",
        'data-sidebar-position': "fixed",
        'data-header-position': "fixed",
    })

    // ========================================================================= //
    //    resize 
    // ========================================================================= //

    function resize () {
        if (window.matchMedia("(max-width: 767px)").matches) {
            $('body').attr('data-sidebar-style', 'overlay');
            $("#main-wrapper").addClass('overlay');

        } else if (window.matchMedia("(max-width: 1199px)").matches) {

            $('body').attr('data-sidebar-style', 'mini');
            $("#main-wrapper").addClass('mini');


        } else {
            $('body').attr('data-sidebar-style', 'full');
            $("#main-wrapper").removeClass('mini');
        }
    }

    resize();

    jQuery(window).resize(function () {
        resize();
    })

});

// ========================================================================= //
//    upload image in drag
// ========================================================================= //

function showPreview (event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("file-ip-1-preview");
        preview.src = src;
        preview.style.display = "block";
    }
}

// ========================================================================= //
//   Preview Pictures
// ========================================================================= //

$(".widget-3 input[type='file']").on("change", function () {
    $(".widget-3").addClass("custom-text");
});

// ========================================================================= //
//   Date Range
// ========================================================================= //


$('input[name="daterange"]').daterangepicker({
    opens: 'right'
}, function (start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
});

jQuery('.datetimepicker').datetimepicker({
    timepicker: false,
    format: 'Y-m-d',
    onChangeDateTime: function (dp, $input) {
        //   alert($input.val())
    }
});

// ========================================================================= //
//  Button Add Test
// ========================================================================= //

$('#butonAddTest').click(function () {
    var structure = `<form>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <select class="form-control form-select">
                    <option>Select Test...</option>
                    <option>Scanner thoracique</option>
                    <option>Covid 19</option>
                    <option>dsdsfd</option>
                    <option>wqd</option>
                    <option>asdfsf</option>
                    <option>fgg</option>
                    <option>uohl</option>
                    <option>Pueba wilson</option>
                    <option>jjjhj</option>
                    <option>hh</option>
                    <option>Badanie Oberon</option>
                    <option>sdsadsa</option>
                    <option>test</option>
                </select>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Description">
            </div>
        </div>
    </div>
    <hr/>

</form>`;
    $(".addTest").append(structure);
    // $('select').selectpicker();

});



// ========================================================================= //
//   refrech select picker inside modal
// ========================================================================= //
$('.selectRefresh').on('shown', function () {
    $('.selectpicker').selectpicker('refresh');
});


// ========================================================================= //
//   Responsive
// ========================================================================= //


function resize () {
    if (window.matchMedia("(max-width: 1199px)").matches) {
        $(".has-submenu").removeClass('active');
    }
}

resize();

jQuery(window).resize(function () {
    resize();
})


jQuery(function ($) {
    var path = window.location.href;
    $('ul li a').each(function () {
        if (window.matchMedia("(max-width: 1199px) and (max-width: 1199px)").matches) {
            if (this.href === path) {
                if ($(this).parent().hasClass("has-submenu")) {
                    $(this).parent().addClass("active-submenu");
                } else {
                    $(this).parent().parent().parent().addClass('active-submenu');
                }
            }
        }

    });
});

/**
 * The method for alert dialog before delete one element
 * @returns 
 */
function confirmAct () {
    if (confirm('Are you sure to delete this?')) {
        return true;
    }
    return false;
}

$(".navigation li a").each(function () {
    if ($(this)[0].href == String(window.location)) {
        // $(".navigation li").removeClass("current");
        $(this).parent("li").addClass('active').siblings().removeClass('active')
    }
});