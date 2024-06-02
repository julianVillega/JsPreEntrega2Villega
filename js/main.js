class Comercio{
    constructor(cuit, nombre, direccion){
        this.cuit = cuit;
        this.nombre = nombre;
        this.direccion = direccion;
    }
}

class Producto{
    constructor(ean, nombre){
        this.ean = ean;
        this.nombre = nombre;
    }
}

class Precio{
    constructor(producto, valor, comercio, fecha) {
        this.producto= producto;        
        this.valor= valor;        
        this.comercio= comercio;
        this.fecha= fecha;        
    }
}

let comercios = [];
let productos = [];
let precios = [];


//funciones para agregar a los arrays.

function agregarComercio(comercio){
    comercios.push(comercio)
}

function agregarProducto(producto){
    productos.push(producto)
}

function agregarPrecio(precio){
    precios.push(precio)
}

// cargo el sistema con algunos datos iniciales.

agregarComercio(new Comercio("00123654", "Carrefour", "calle 12 nro 123"))
agregarComercio(new Comercio("09275654", "Super Lu", "calle 44 nro 1200"))
agregarComercio(new Comercio("98133654", "El chino", "av 51 nro 456"))
agregarComercio(new Comercio("15612367", "Lo de chicho", "Bv Americas nro 846"))
agregarComercio(new Comercio("98761452", "Almacen la Gloria", "calle 32 nro 444"))

agregarProducto(new Producto("1456987","Dulce de leche"));
agregarProducto(new Producto("9876458","Fideos"));
agregarProducto(new Producto("7841146","Arroz"));
agregarProducto(new Producto("3331254","Leche"));
agregarProducto(new Producto("9546786","Manteca"));


function generarPrecios(){
    //1000ms por segundo, 60 seg por minuto, 60 min por hr, 24hr por dia
    const msPorDia = 1000*60*60*24;
    const fechaFin = new Date();
    const fechaInicio = fechaFin - 30 * msPorDia;
    // Agregamos 5 precios de cada producto en cada comercio
    for(let producto = 0; producto <= 4; producto++){
        for(let comercio = 0; comercio <= 4; comercio++){
            for(let cantidadDePrecios = 0; cantidadDePrecios < 5; cantidadDePrecios ++){
                fecha = new Date(Math.random()*(fechaFin- fechaInicio) + fechaInicio)
                let valor = Math.random()*1000;
                valor = valor.toFixed(2)
                agregarPrecio(new Precio(productos[producto], valor, comercios[comercio], fecha));
            }
        }
    }
}

// funciones de ordenamiento

function ordenarPrecios(precios, criterio){
    //recibe una lista de precios y la ordena segun el criterio
    let copia = precios.slice();
    switch (criterio){
        case "fecha":
            return copia.sort((a, b) => a.fecha - b.fecha);
        case "valor":
            return copia.sort((a, b) => a.valor - b.valor);
    }
    return copia
}

// funciones de filtrado
function preciosDelProducto(producto){
    return precios.filter(p => p.producto == producto)
}


function seleccionarElemento(textoInstructivo, textoError, lista, funcionDeTexto){
    /*
    Recibe una lista y genera un prompt para que el usuario seleccione un elemento.
    Parametros:
    textoInstructivo: texto que se muestra como titulo del prompt.
    textoError: texto que se muestra si el usuario selecciona un opción inváldia.
    lista: lista de elemntos que se deben brindar como opción de selección.
    
        funcionDeTexto: funcón que debe retornar el texto para cada opcion, por ejemplo
        si la lista contiene comercios, esta funcion podria recibir como parametro un comercio,
        y retornar su nombre.
    Retorna el elemento seleccionado, o la string "cancelar"
    */
    let elementoSeleccionado;
    for(let i = 0; i< lista.length; i++){
        textoInstructivo = textoInstructivo.concat(`${i}: ${funcionDeTexto(lista[i])}\n`)
    }
    while(true){
        elementoSeleccionado = prompt(textoInstructivo);
        if(elementoSeleccionado === null){
            alert("operación cancelada")
            return "cancelar"
        }
        if(isNaN(elementoSeleccionado)|| elementoSeleccionado ==='' ||!(elementoSeleccionado >= 0 && elementoSeleccionado < lista.length)){
            alert(textoError);
            continue
        }
        return lista[elementoSeleccionado]
    }

}

function mainLoop() {
    while (true) {
        let operacion = seleccionarElemento(
            "Ingrese el numero de la operacion a realizar:\n",
            "la opcione seleccionada es invalida",
            [0,1],
            operacion => {
                let textos = ["Consultar los precios mas recientes para un producto." ,"Consultar el historial de precios de un producto."]
                return textos[operacion]
            }
        )
        if(operacion == "cancelar"){
            alert("Gracias por utlizar nuestros servicios, recargue la pagina para volver a operar")
            break
        }
        if (operacion == "0") {
            let producto = seleccionarElemento("Selecciona un producto\n","la opcion seleccionada es invalida",productos, p => p.nombre);
            // let producto = seleccionarProducto(productos);
            if(producto == "cancelar"){
                continue;
            }
            let p = preciosDelProducto(producto)
            p = ordenarPrecios(p, "valor");
            texto = `Precios: \n`
            p.forEach(e => texto = texto.concat(`Precio: ${e.valor} Fecha: ${e.fecha.toLocaleString()} Comercio: ${e.comercio.nombre}\n\n`))
            alert(texto);
            continue;
        }
        else{
            // seleccionar el producto
            let producto = seleccionarElemento("Selecciona un producto\n","la opcion seleccionada es invalida",productos, p => p.nombre);
            if(producto == "cancelar"){
                continue;
            }

            // obtener los comercios que venden ese producto.
            let comerciosQueVendenProducto = comercios.filter(comercio => precios.some(p => (p.producto == producto) && p.comercio == comercio))
            
            // seleccionar el comercio
            let comercioSeleccionado = seleccionarElemento("Selecciona un comercio\n",'El comercio seleccionado es inválido',comerciosQueVendenProducto, c => c.nombre);
            if(comercioSeleccionado == "cancelar"){
                continue;
            }
            // obtener los precios del producto en ese comercio
            let preciosEnComercio = precios.filter(p => p.producto == producto && p.comercio == comercioSeleccionado)
            
            // ordenar los precios por fecha
            preciosEnComercio.sort((precio1,precio2) => precio2.fecha - precio1.fecha)
            
            //construir el texto del alert
            texto = `Historial de precios del producto: ${producto.nombre} en ${comercioSeleccionado.nombre}: \n`;
            preciosEnComercio.forEach(p => texto = texto.concat(`fecha: ${p.fecha.toLocaleDateString()} precio: ${p.valor}\n\n`))
            //mostrar el alert.
            alert(texto)
        }
    }
}


generarPrecios()
mainLoop()

