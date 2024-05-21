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
agregarProducto(new Producto("6663486","Edulcorante"));

function generarPrecios(){
    //1000ms por segundo, 60 seg por minuto, 60 min por hr, 24hr por dia
    const msPorDia = 1000*60*60*24;
    const fechaFin = new Date();
    const fechaInicio = fechaFin - 30 * msPorDia;
    for(let i = 0; i <= 5; i++){
        for(let j = 0; i <= 5; i++){
            fecha = new Date(Math.random()*(fechaFin- fechaInicio) + fechaInicio)
            let valor = Math.random()*100;
            agregarPrecio(new Precio(productos[i], valor, comercios[j], fecha));
        }
    }
}


generarPrecios();
console.log(precios)