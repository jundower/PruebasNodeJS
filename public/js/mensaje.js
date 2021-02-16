    var value="";
    function obtener_mensaje(searchvalue) { //start doSearch
        value="Valor";
        if (searchvalue.includes("Cannot insert duplicate")){
            value="Ya existe el elemento que se desea ingresar";
        }
        
        // if (searchvalue.contains("Cannot insert duplicate")){
        //     value="Ya existe el elemento que se desea ingresar";
        // }else if (searchvalue.contains("")){
        //     value="";
        // }
        return value
    }; //end 
