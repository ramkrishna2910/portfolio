$("#status").fadeOut();
$("#preloader").delay(350).fadeOut("slow");
$("body").delay(350).css({ overflow: "visible" });

$(window).on("scroll", function () {
    if ($(window).scrollTop() >= 50) {
        $(".sticky").addClass("stickyadd");
    } else {
        $(".sticky").removeClass("stickyadd");
    }
});

$(".navbar-nav a, .scroll_down a").on("click", function (e) {
    var t = $(this);
    $("html, body").stop().animate(
        { scrollTop: $(t.attr("href")).offset().top - 0 },
        1500,
        "easeInOutExpo"
    );
    e.preventDefault();
});

$("#navbarCollapse").scrollspy({ offset: 20 });

$(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) {
        $(".back_top").fadeIn();
    } else {
        $(".back_top").fadeOut();
    }
});

$(".back_top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1000);
    return false;
});
