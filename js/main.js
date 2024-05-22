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
    for(let i = 0; i <= 4; i++){
        for(let j = 0; j <= 4; j++){
            fecha = new Date(Math.random()*(fechaFin- fechaInicio) + fechaInicio)
            let valor = Math.random()*1000;
            valor = valor.toFixed(2)
            agregarPrecio(new Precio(productos[i], valor, comercios[j], fecha));
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

generarPrecios()
mainLoop()

function seleccionarProducto(listaDeProductos){
    let texto = "selecciona el producto:\n"
    let producto;
    for (let i = 0; i < listaDeProductos.length; i++) {
        texto = texto.concat(`${i}: ${listaDeProductos[i].nombre} \n`);
    }
    while(true){
        producto = prompt(texto);
        if(isNaN(producto)|| producto ==='' ||!(producto >= 0 && producto < listaDeProductos.length)){
            alert("el producto ingresado es inválido");
        }
        else{
            break
        }
    }
    return producto
}

function seleccionarComercio(comercios){
    let texto = `Selecciona el comercio: \n`;
    let comercioSeleccionado;
    for(let i = 0; i< comercios.length; i++){
        texto = texto.concat(`${i}: ${comercios[i].nombre}\n`)
    }
    while(true){
        comercioSeleccionado = prompt(texto);
        if(isNaN(comercioSeleccionado)|| comercioSeleccionado ==='' ||!(comercioSeleccionado >= 0 && comercioSeleccionado < comercios.length)){
            alert("el comercio ingresado es inválido");
        }
        return comercios[comercioSeleccionado]
    }
}

function mainLoop() {
    while (true) {
        let texto = `Ingrese el numero de la operacion a realizar:
        1:Consultar los precios mas recientes para un producto.
        2:Consultar el historial de precios de un producto.`
        let operacion = prompt(texto)
        if (!(operacion == "1" || operacion == "2")) {
            alert("la operación ingresada es inválida");
            continue;
        }

        if (operacion == "1") {
            let producto = seleccionarProducto(productos);
            let p = preciosDelProducto(productos[producto])
            p = ordenarPrecios(p, "valor");
            texto = `Precios: \n`
            p.forEach(e => texto = texto.concat(`Precio: ${e.valor} Fecha: ${e.fecha.toLocaleString()} Comercio: ${e.comercio.nombre}\n\n`))
            alert(texto);
            continue;
        }
        else{
            // seleccionar el producto
            let producto = seleccionarProducto(productos);
            producto = productos[producto];


            // obtener los comercios que venden ese producto.
            let comerciosQueVendenProducto = comercios.filter(comercio => precios.some(p => (p.producto == producto) && p.comercio == comercio))
            
            // seleccionar el comercio
            let comercioSeleccionado = seleccionarComercio(comerciosQueVendenProducto);
            
            // obtener los precios del producto en ese comercio
            let preciosEnComercio = precios.filter(p => p.producto == producto && p.comercio == comercioSeleccionado)
            
            // ordenar los precios
            preciosEnComercio.sort((precio1,precio2) => precio1.valor - precio2.valor)
            
            //construir el texto del alert
            texto = `Historial de precios del producto: ${producto.nombre} en ${comercioSeleccionado.nombre}: \n`;
            preciosEnComercio.forEach(p => texto = texto.concat(`fecha: ${p.fecha.toLocaleDateString()} precio: ${p.valor}\n\n`))
            //mostrar el alert.
            alert(texto)
        }
    }
}