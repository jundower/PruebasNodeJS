//Debe referenciarse en el main los siguientes js ubicados en la carpeta "exportar" de "uitlitarios"
//exportExcel.js
//ExportFormar.js
var createExcelFromGrid = function(gridID,filename,cabecera) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
            Title: "ErpSoft",
            Subject: "ErpSoft",
            Author: "ErpSoft",
            CreatedDate: new Date(2017,12,19)
    };
    
    wb.SheetNames.push(filename);

    var grid = $('#'+gridID);
    var rowIDList = grid.getDataIDs();
    var row = grid.getRowData(rowIDList[0]); 
    var colNames = [];
    var i = 0;
    for(var cName in row) {
        colNames[i++] = cName; // Capture Column Names
    }
    // var ws_data = ['RUC','Nombre', 'F. Inicio', 'F. Vencimiento','Licencias','Obs.','Días'];
    var ws_data=[];
    
    // ws_data.push("");
    ws_data.push(cabecera);
    for(var j=0;j<rowIDList.length;j++) {
        var data=[];
        row = grid.getRowData(rowIDList[j]); // Get Each Row
        for(var i = 0 ; i<colNames.length ; i++ ) {
            // console.log(colNames[i]);pets.includes('cat')
            cabecera.includes(colNames[i]) ? data.push(row[colNames[i]]) : ""; // Create a CSV delimited with ;
        }
        ws_data.push(data);
    }

    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets[filename] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) {

            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
            
    }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename+'.xlsx');
}

var createExcelFromGridSubGrid = function(gridID,filename,cabecera,subGridID,subGridCabecera, footer) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
            Title: "ErpSoft",
            Subject: "ErpSoft",
            Author: "ErpSoft",
            CreatedDate: new Date(2017,12,19)
    };
    
    wb.SheetNames.push(filename);

    var grid = $('#'+gridID);
    var subgrid = $('#'+subGridID);
    var rowIDList = grid.getDataIDs();
    var subrowIDList = subgrid.getDataIDs();
    var row = grid.getRowData(rowIDList[0]); 
    var subrow = subgrid.getRowData(subrowIDList[0]); 
    var colNames = [];
    var subcolNames = [];
    var i = 0;
    for(var cName in row) {
        colNames[i++] = cName; // Capture Column Names
    }
    for(var cName in subrow) {
        subcolNames[i++] = cName; // Capture Column Names
    }
    // var ws_data = ['RUC','Nombre', 'F. Inicio', 'F. Vencimiento','Licencias','Obs.','Días'];
    var ws_data=[];
    
    // ws_data.push("");
    ws_data.push(cabecera);
    for(var j=0;j<rowIDList.length;j++) {
        var data=[];
        row = grid.getRowData(rowIDList[j]); // Get Each Row
        for(var i = 0 ; i<colNames.length ; i++ ) {
            // console.log(colNames[i]);pets.includes('cat')
            cabecera.includes(colNames[i]) ? data.push(row[colNames[i]]) : ""; // Create a CSV delimited with ;
        }
        ws_data.push(data);
    }

    ws_data.push(subGridCabecera);
    for(var j=0;j<subrowIDList.length;j++) {
        var data=[];
        subrow = subgrid.getRowData(subrowIDList[j]); // Get Each Row
        for(var i = 0 ; i<subcolNames.length ; i++ ) {
            // console.log(colNames[i]);pets.includes('cat')
            subGridCabecera.includes(subcolNames[i]) ? data.push(subrow[subcolNames[i]]) : ""; // Create a CSV delimited with ;
        }
        ws_data.push(data);
    }
    ws_data.push(footer);
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets[filename] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) {

            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
            
    }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename+'.xlsx');
}



function exportGrid(table){
    mya = $("#" + table).getDataIDs(); // Get All IDs
  var data = $("#" + table).getRowData(mya[0]); // Get First row to get the
  // labels
  var colNames = new Array();
  var ii = 0;
  for ( var i in data) {
      colNames[ii++] = i;
  } // capture col names
  
  var html = "<html><head>"
          + "<style script=&quot;css/text&quot;>"
          + "table.tableList_1 th {border:1px solid black; text-align:center; "
          + "vertical-align: middle; padding:5px;}"
          + "table.tableList_1 td {border:1px solid black; text-align: left; vertical-align: top; padding:5px;}"
          + "</style>"
          + "</head>"
          + "<body style=&quot;page:land;&quot;>";
  
  
  for ( var k = 0; k < colNames.length; k++) {
      html = html + "<th>" + colNames[k] + "</th>";
  }
  html = html + "</tr>"; // Output header with end of line
  for (i = 0; i < mya.length; i++) {
      html = html + "<tr>";
      data = $("#" + table).getRowData(mya[i]); // get each row
      for ( var j = 0; j < colNames.length; j++) {
       html = html + "<td>" + data[colNames[j]] + "</td>"; // output each Row as
                  // tab delimited
      }
      html = html + "</tr>"; // output each row with end of line
  }
  html = html + "</table></body></html>"; // end of line at the end
//   alert(html);
  html = html.replace(/'/g, '&apos;');
  function s2ab(s) {

          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
          
  }
  saveAs(new Blob([s2ab(html)],{type:"application/octet-stream"}), "filename"+'.xlsx');
  //  var form = "<form name='pdfexportform' action='generategrid' method='post'>";
  //  form = form + "<input type='hidden' name='pdfBuffer' value='" + html + "'>";
  //  form = form + "</form><script>document.pdfexportform.submit();</sc"
  //      + "ript>";
  //  OpenWindow = window.open('', '');
  //  OpenWindow.document.write(form);
  //  OpenWindow.document.close();
  }



  var createTableFromGrid = function(gridID,filename,cabecera) {
    var table='<table style="border-collapse: collapse; border: 0.5px solid #6e6e6e">'
    var thead='<thead><tr>';
    var tbody='<tbody>';
    for(var i=0;i<cabecera.length;i++){
        thead+='<th style="border: 0.5px solid #6e6e6e"><div class="truncate">'+cabecera[i]+"</div></th>"
    }
    thead+="</tr></thead>";
    table+=thead;

    var grid = $('#'+gridID);
    var rowIDList = grid.getDataIDs();
    var row = grid.getRowData(rowIDList[0]); 
    var colNames = [];
    var i = 0;
    for(var cName in row) {
        colNames[i++] = cName; // Capture Column Names
    }

    for(var j=0;j<rowIDList.length;j++) {
        var data=[];
        row = grid.getRowData(rowIDList[j]); // Get Each Row
        tbody+="<tr>";
        for(var i = 0 ; i<colNames.length ; i++ ) {
            cabecera.includes(colNames[i]) ? tbody+= '<td style="border: 0.5px solid #6e6e6e"><div class="truncate">'+row[colNames[i]]+"</div></td>": ""; // Create a CSV delimited with ;
        }
        tbody+="</tr>";
    }
    
    tbody+="</tbody>";
    table+=tbody;
    table+="</table>";
    
    $("#reporte_print").html("");
    $("#reporte_print").append(table);
    
    $("#reporte_print").printThis();
    // var wb = XLSX.utils.book_new();
    // wb.Props = {
    //         Title: "ErpSoft",
    //         Subject: "ErpSoft",
    //         Author: "ErpSoft",
    //         CreatedDate: new Date(2017,12,19)
    // };
    
    // wb.SheetNames.push(filename);

    // var grid = $('#'+gridID);
    // var rowIDList = grid.getDataIDs();
    // var row = grid.getRowData(rowIDList[0]); 
    // var colNames = [];
    // var i = 0;
    // for(var cName in row) {
    //     colNames[i++] = cName; // Capture Column Names
    // }
    // // var ws_data = ['RUC','Nombre', 'F. Inicio', 'F. Vencimiento','Licencias','Obs.','Días'];
    // var ws_data=[];
    
    // // ws_data.push("");
    // ws_data.push(cabecera);
    // for(var j=0;j<rowIDList.length;j++) {
    //     var data=[];
    //     row = grid.getRowData(rowIDList[j]); // Get Each Row
    //     for(var i = 0 ; i<colNames.length ; i++ ) {
    //         // console.log(colNames[i]);pets.includes('cat')
    //         cabecera.includes(colNames[i]) ? data.push(row[colNames[i]]) : ""; // Create a CSV delimited with ;
    //     }
    //     ws_data.push(data);
    // }

    // var ws = XLSX.utils.aoa_to_sheet(ws_data);
    // wb.Sheets[filename] = ws;
    // var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    // function s2ab(s) {

    //         var buf = new ArrayBuffer(s.length);
    //         var view = new Uint8Array(buf);
    //         for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    //         return buf;
            
    // }
    // saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), filename+'.xlsx');
}