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
        localStorage.setItem("hamburger", jQuery("body").hasClass("sidebar-toggled"));
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

/**
 * The function for dropdown menu
 */
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
 * @returns true to confirm delete
 *          false cancel deletion
 */
function confirmAct () {
    if (confirm('Are you sure to delete this?')) {
        return true;
    }
    return false;
}

/**
 * The method for changing the navagation status
 */
$(".navigation li a").each(function () {
    if ($(this)[0].href == String(window.location)) {
        $(this).parent("li").addClass('active').siblings().removeClass('active')
    }
});

