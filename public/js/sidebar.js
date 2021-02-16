
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $('.dropdown-toggle').on('click',function(){
        
        $(this).toggleClass("collapsed");
        var this_ul=$(this).attr('href');
        $('.dropdown-toggle').each(function () {
            var id_uls=$(this).attr('href');
            if(this_ul!=id_uls){
                $(this).attr('aria-expanded','false');
                $(id_uls).removeClass("show");
                $(this).addClass("collapsed");
            }
        });

        $('.sidebar-tab').each(function () {
            $(this).removeClass("show");
            $(this).removeClass("active");
        });

        $(".sidebar-subelement").each(function () {
            $(this).removeClass("active");
        });

    });

    $('.sidebar-subelement1').on('click',function(){
        
        $(this).toggleClass("collapsed");
        var this_ul=$(this).attr('href');
        $('.sidebar-subelement1').each(function () {
            var id_uls=$(this).attr('href');
            if(this_ul!=id_uls){
                $(this).attr('aria-expanded','false');
                $(id_uls).removeClass("show");
                $(this).addClass("collapsed");
            }
        });
        
        $('.sidebar-subelement3').each(function () {
            var id_uls=$(this).attr('href');
            $(this).attr('aria-expanded','false');
            $(this).addClass("collapsed");
            $(id_uls).removeClass("show");
        });

        $(".sublist-unstyled").each(function () {
            $(this).removeClass("active");
        });

    });


    //Para los Tabs Redondeados, sin eso, no se redondea correctamente los bordes
    $(".nav-tab-rounded").click(function(e) {
        $("li").removeClass("active");
        $(this).addClass("active");
    });
    configuracion_visibilidad();
});



function configuracion_visibilidad(){
    $.ajax({
        type: 'POST',
        url: "/configuraciones/configuracion_visibilidad",
        success: function (e){
            var array = e;
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.acceso=='N'){
                    $("#"+element.modulo).prop("href","#");
                    $("#"+element.modulo).removeAttr("target");
                }
            }   
            //un favor haz que haga un reccorido a todo el array)
        }
    });
}