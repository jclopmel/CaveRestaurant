$("#select1").change(choose);

var orderList =[];
var dish;

function add(name, prize){              
    
    var dish= {
        "name"    :name,
        "prize"    :prize,
        "quantity"  :1
    }
   var y=-1;
                                             
    for (var i=0; i< orderList.length; i++){                    //Buscar el valor .nombre en el Array de objetos y devuelve la posición i
            var x = orderList[i].name;
                if(x.includes(dish.name)){
                    y = i;
                }
        }

   if(y>=0){                                                    //Si el valor ya está includo suma uno a la cantidad, en caso contrario añade el objeto
        orderList[y].quantity++;
    }else{
        orderList.push(dish);         
    }
    
}




function mainOrder(){
    var finalPrize=0;
    for (var i=0; i< orderList.length; i++){                              //Sumatorio de los precios
        finalPrize=finalPrize+((orderList[i].prize)*(orderList[i].quantity));
    }
    $("#pedido").empty();                                                   //vacía el área antes de escribir

    for (var i=0; i< orderList.length; i++){                             //Añade platos del Array al pedido lateral, su cantidad y botones
        $("#pedido").prepend("<li><button onclick='addOrDelete(this)' type='button' class='mas btn btn-secondary btn-sm'>+</button><button onclick='addOrDelete(this)' type='button' class='menos btn btn-secondary btn-sm'>-</button>"+orderList[i].quantity+" x "+orderList[i].name+"</li>");    
    }
    
    $("#pedido").append("<hr><p class='text-center padding2'>Precio final: <b>"+finalPrize+"</b> €</p>");        //Añade el total
}

/*---------------------------------------------------Elementos añadidos al pedido--------------------------------------------------*/

function toOrder(data){

    var name   = data.parentNode.firstChild.innerHTML;
    var prize  = Number(data.parentNode.children[3].innerHTML.substr(12,2));

    add(name,prize);
    mainOrder();

}

/* -----------------------------------Funcion para al cambiar el Select, muestre los resultado-------------------------------------------------*/
function choose (){

        $.getJSON( "http://localhost:8000/js/data.json", function( data ) {                 //solicito datos

            var datamenu = data.platos;

            $("#platosMostrados").empty();                                                   //borra el div antes de escribir

            for (var i=0; i< datamenu.length; i++){                                            //recorrer el array y sus objetos

                if (datamenu[i].categoria == $("#select1").val()){                               //condicion para enviar datos al menu.html

                    var name            = datamenu[i].nombre;
                    var description     = datamenu[i].descripcion;
                    var prize           = datamenu[i].precio;
                    var photo           = datamenu[i].foto;

                        $("#platosMostrados").append("<div id ='menu"+i+"' class='container-fluid col-5 menu'></div>");                      
                        
                        $("#menu"+i).append("<h4>"+name+"</h4>");
                        $("#menu"+i).append("<img class='carta imagenPlato' src='"+photo+"' alt='Dishes photo'>");
                        $("#menu"+i).append("<p class='carta'>"+description.substr(0,100)+" (...)</p>");
                        $("#menu"+i).append("<p class='carta'> <b>Precio: "+prize+" € </b></p>");
                        $("#menu"+i).append("<button onclick='toOrder(this)' class='btn-secondary btn-lg btn-block carta btn' type='button'>Añadir</button>");
                    
                }

            }
        });
           

}


/*-----------------------------Función de los botones de añadir y quitar elementos del pedido---------------------------------------------*/
function addOrDelete (data){                                        //la clave para diferenciar lso botones está en el innerText

        var temp = data.parentNode.innerText.substr(6,50);              //Localiza el nombre del plato
        var temp2 = temp.toString()
        var temp3 = -1;

        for (var i=0; i< orderList.length; i++){      //Buscar el valor .nombre en el Array de objetos y devuelve la posición i
            var x = orderList[i].name;
                if(x.includes(temp2)){
                    temp3 = i;
                }
        }

        var x   = data.innerText;
        console.log(x);

        if(x.includes("-")){
            if(orderList[temp3].quantity>1){              //Comprueba si hay mas de uno para restar o eliminar del array
                orderList[temp3].quantity--
            }else{
                orderList.splice(temp3,1);
            }
        }else{

            orderList[temp3].quantity++;

        }
          

    mainOrder();
}