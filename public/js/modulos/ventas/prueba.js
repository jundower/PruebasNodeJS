var myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1
}
var canvas;
var ctx;
var viewport;
$(document).ready(function() {
    $(".print_container").removeClass("d---none");
    pdfjsLib.getDocument('/erp/0000000001/pdf/prueba.pdf').then((pdf) => {
        myState.pdf = pdf;
        render();
    });
    document.getElementById('go_previous')
        .addEventListener('click', (e) => {
            if(myState.pdf == null
               || myState.currentPage == 1) return;
            myState.currentPage -= 1;
            document.getElementById("current_page")
                    .value = myState.currentPage;
            render();
    });
    document.getElementById('go_next')
    .addEventListener('click', (e) => {
        if(myState.pdf == null
            || myState.currentPage > myState.pdf
                                            ._pdfInfo.numPages) 
            return;
        
        myState.currentPage += 1;
        document.getElementById("current_page")
                .value = myState.currentPage;
        render();
    });
    document.getElementById('current_page')
        .addEventListener('keypress', (e) => {
            if(myState.pdf == null) return;
         
            // Get key code
            var code = (e.keyCode ? e.keyCode : e.which);
         
            // If key code matches that of the Enter key
            if(code == 13) {
                var desiredPage = 
                        document.getElementById('current_page')
                                .valueAsNumber;
                                 
                if(desiredPage >= 1 
                   && desiredPage <= myState.pdf
                                            ._pdfInfo.numPages) {
                        myState.currentPage = desiredPage;
                        document.getElementById("current_page")
                                .value = desiredPage;
                        render();
                }
            }
    });
    document.getElementById('zoom_in')
    .addEventListener('click', (e) => {
        if(myState.pdf == null) return;
        myState.zoom += 0.5;
        render();
    });
    document.getElementById('zoom_out')
    .addEventListener('click', (e) => {
        if(myState.pdf == null) return;
        myState.zoom -= 0.5;
        render();
    });
});
function render() {
    myState.pdf.getPage(myState.currentPage).then((page) => {
        canvas = document.getElementById("pdf_renderer");
        ctx = canvas.getContext('2d');
        viewport = page.getViewport(myState.zoom);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
 
    });
}



function convert_HTML_To_PDF() {
	// var doc = new jsPDF();
    var estilos = 
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous"> \n'+
    '<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>\n'+
    '<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script> \n'
    var elementHTML = estilos + $('#contnet').html();

	var specialElementHandlers = {
		'#elementH': function (element, renderer) {
			return true;
		}
    };
    // html2canvas(document.getElementById('contnet')).then(function(canvas) {
    //     var img=canvas.toDataURL("image/png");
    //     var pdf = new jsPDF();
    //     pdf.addImage(img,'JPEG',20,20);
    //     pdf.save('test.pdf');
    // });
    html2canvas($('#contnet')[0]).then(function(canvas) {
        document.body.appendChild(canvas);
    });

    // html2canvas($('#contnet'),{
    //     onrendered:function(canvas){
    //         console.log("asdasd");
        
    //         // var img=canvas.toDataURL("image/png");
    //         // var pdf = new jsPDF();
    //         // pdf.addImage(img,'JPEG',20,20);
    //         // pdf.save('test.pdf');
    //     }
 
    // });

	// doc.fromHTML(elementHTML, 15, 15, {
    //     'width': 170,
    //     'elementHandlers': specialElementHandlers
    // });
	// // Save the PDF
	// doc.save('sample-document.pdf');


}