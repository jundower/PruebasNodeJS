const deepCopy = function(src) {
    let target = {};
    // using for/in on object also returns prototype properties
    for (let prop in src) {
        // .hasOwnProperty() filters out these prototype properties.
        if (src.hasOwnProperty(prop)) {
            target[prop] = src[prop]; //iteratively copies over values, not references
        }
    }
    return target;
}
function resize_jqgrid_with_min(jq_grid, min_width, min_height){
    var jqGridWrapperId = "#gbox_" + jq_grid.attr('id')
    jq_grid.setGridWidth(min_width); 
    jq_grid.setGridWidth($(jqGridWrapperId).parent().width()); 
    jq_grid.setGridHeight(min_height); 
    jq_grid.setGridHeight($(jqGridWrapperId).parent().height()); 

}
function resize_jqgrid_comparative_height(jq_grid, minimo, comparativo){
    var jqGridWrapperId = "#gbox_" + jq_grid.attr('id')

    jq_grid.setGridWidth(100); 
    jq_grid.setGridHeight(100); 
    jq_grid.setGridWidth($(jqGridWrapperId).parent().width()-20); 

    var alto = $(window).height(); //alto de la ventana
    var nuevo_alto = ((alto < (comparativo *1 )+ minimo)? (comparativo *1 )+ minimo: alto )  - comparativo;
    jq_grid.setGridHeight(nuevo_alto);
}

function resize_jqgrid(jq_grid){
    var jqGridWrapperId = "#gbox_" + jq_grid.attr('id')
    jq_grid.setGridWidth(100); 
    jq_grid.setGridHeight(100); 
    jq_grid.setGridWidth($(jqGridWrapperId).parent().width()); 
    jq_grid.setGridHeight($(jqGridWrapperId).parent().height()); 
}


function resize_jqgrid_porcentajes(jq_grid, alto_porc, ancho_porc ){
    jq_grid.setGridWidth(100); 
    jq_grid.setGridHeight(100); 

    var alto = $(window).height(); //alto de la ventana
    var ancho = $(window).width(); //ancho de la ventana
    var nuevo_alto = alto*alto_porc/100;
    var nuevo_ancho = ancho*ancho_porc/100;
    jq_grid.setGridHeight((nuevo_alto>100 ? nuevo_alto : 100));
    jq_grid.setGridWidth((nuevo_ancho>100 ? nuevo_ancho : 100));
}

function resize_jqgrid_restar(jq_grid, restar_alto, restar_ancho){
    // console.log(restar_alto)
    // console.log(restar_ancho)
    jq_grid.setGridWidth(100); 
    jq_grid.setGridHeight(100); 
    var alto = $(window).height(); //alto de la ventana
    var ancho = $(window).width(); //ancho de la ventana

    jq_grid.setGridHeight((alto - restar_alto>100 ? alto - restar_alto : 100));
    jq_grid.setGridWidth((ancho - restar_ancho>100 ? ancho - restar_ancho : 100));

}

function tsvToJson(tsvText){
    //Split all the text into seperate lines on new lines and carriage return feeds
    var allTextLines = tsvText.split(/\r\n|\n/);
    //Split per line on tabs and commas
    var headers = allTextLines[0].split(/\t|,/);
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(/\t|,/);
        if (data.length == headers.length) {
                    
          var row = {};
          for (var j=0; j<headers.length; j++) {
            row[j] = data[j];
          }
          lines.push(row);
        }
        
    }

    return lines;
}

function borrarUltimaLetra(text){
    return text.slice(0,-1);
}