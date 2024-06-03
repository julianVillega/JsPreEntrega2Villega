class Comercio{
    constructor(cuit, nombre, direccion, latlang){
        this.cuit = cuit;
        this.nombre = nombre;
        this.direccion = direccion;
        this.latlang = latlang;
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

class Map{
    constructor(){
        this.markers = [];
        this.map = L.map('map').setView([-34.92052462063165, -57.94446936030479], 13);
        // Add the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addMarker(latlng){
        const marker = L.marker(latlng);
        this.markers.push(marker);
        marker.addTo(this.map);
        return marker;
    }

    mostrarComercios(comercios){
        for(let comercio of comercios){
            const marker = this.addMarker(comercio.latlang);
            marker.bindPopup(`${comercio.nombre}\nDirección: ${comercio.direccion}`)
            marker.on('click',() => abrirComercio(comercio))
        }
    }

    quitarMarker(marker){
        this.map.removeLayer(marker);
        this.markers = this.markers.filter(m => m !== marker);
    }
    

}

let comercios = [];
let productos = [];
let precios = [];
let map;
//objeto para guardar el mapa de leafleat js

// let map = {map:null}

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

agregarComercio(new Comercio("00123654", "Carrefour", "calle 12 nro 123",[-34.92306135547813, -57.94991434646028]))
agregarComercio(new Comercio("09275654", "Super Lu", "av 60 nro 1200",[-34.92339482939376, -57.944068539651944]))
agregarComercio(new Comercio("98133654", "El chino", "av 51 nro 456",[-34.92170122221505, -57.94498483514024]))
agregarComercio(new Comercio("15612367", "Lo de chicho", "Bv Americas nro 846",[-34.92436488977569, -57.94811562618901]))
agregarComercio(new Comercio("98761452", "Almacen la Gloria", "calle 32 nro 444",[-34.924987645034854, -57.94625914898358]))

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

function armarHeader(){
    const body = document.body;
    const header = document.createElement("header");
    header.classList.add("header");
    const title = document.createElement("h1");
    title.classList.add("header__title");
    title.innerText = "PubliPrecios";
    header.appendChild(title);
    body.append(header);
}

function armarMain(){
    const body = document.body;
    // creamos el main
    const main = document.createElement("main");
    main.classList.add("main");

    // creamos la barra de busqueda
    const form = document.createElement("form");
    form.classList.add("main__search-form");
    main.appendChild(form);

    const labelBusqueda = document.createElement("label");
    labelBusqueda.innerText = "Buscar:";
    labelBusqueda.setAttribute("for","input_busqueda");
    form.appendChild(labelBusqueda);

    const input_busqueda = document.createElement("input");
    input_busqueda.type = "text";
    input_busqueda.name = "input_busqueda";
    input_busqueda.id = "input_busqueda";
    form.appendChild(input_busqueda);

    const labelCheckboxProductos = document.createElement("label");
    labelCheckboxProductos.setAttribute("for","checkbox_productos");
    labelCheckboxProductos.innerText = "Buscar Productos";
    form.appendChild(labelCheckboxProductos);

    const inputCheckboxProductos = document.createElement("input");
    inputCheckboxProductos.type = "checkbox";
    inputCheckboxProductos.id ="checkbox_productos";
    inputCheckboxProductos.value = "false";
    form.appendChild(inputCheckboxProductos);

    const labelCheckboxLocales = document.createElement("label");
    labelCheckboxLocales.setAttribute("for","checkbox_locales");
    labelCheckboxLocales.innerText = "Buscar locales";
    form.appendChild(labelCheckboxLocales);

    const inputCheckboxLocales = document.createElement("input");
    inputCheckboxLocales.type = "checkbox";
    inputCheckboxLocales.id ="checkbox_locales";
    inputCheckboxLocales.value = "false";
    form.appendChild(inputCheckboxLocales);

    const btnBuscar = document.createElement("button");
    btnBuscar.innerText = "Buscar";
    btnBuscar.id = "btn-buscar";
    form.appendChild(btnBuscar);
    
    // creamos el mapa

    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    mapDiv.classList.add("main__map");
    main.appendChild(mapDiv);    
    body.appendChild(main);
    // inicializarMapa(map);
    map = new Map();
    map.mostrarComercios(comercios);
}

function abrirComercio(comercio){
    //muestra un modal con el comercio para poder operar sobre el mismo
    const body = document.body;
    
    //contenedor principal
    const divComercio = document.createElement('div');
    divComercio.classList.add('comercio-div');
    
    //cabecera con info basica del comercio
    const divCabecera = document.createElement('div');
    divCabecera.classList.add("comercio-div__cabecera");
    divComercio.appendChild(divCabecera);

    const nombreComercio = document.createElement('h2');
    nombreComercio.innerText = comercio.nombre;
    divCabecera.appendChild(nombreComercio);


    const btnCerrar = document.createElement('button');
    btnCerrar.innerText = "X";
    btnCerrar.classList.add("comercio-div__btn-cerrar");
    btnCerrar.addEventListener('click',() => divComercio.remove());
    divCabecera.appendChild(btnCerrar);

    const dirreccionComercio = document.createElement('h3');
    dirreccionComercio.innerText = comercio.direccion;
    divCabecera.appendChild(dirreccionComercio);
    
    //buscador de productos
    const formBusqueda = document.createElement('form');
    formBusqueda.classList.add("comercio-div__form");
    divComercio.appendChild(formBusqueda);

    const labelBuscar = document.createElement("label");
    labelBuscar.setAttribute("for","input_busqueda");
    labelBuscar.innerText = "Buscar Productos:";
    formBusqueda.appendChild(labelBuscar);

    const busquedaInput = document.createElement("input");
    busquedaInput.type = "text";
    busquedaInput.id = "input_busqueda";
    formBusqueda.appendChild(busquedaInput);

    const btnBuscar = document.createElement("button");
    btnBuscar.addEventListener("click",()=> console.log(buscando));
    btnBuscar.id = "comercio_btn_buscar";
    btnBuscar.innerText = "Buscar";
    formBusqueda.appendChild(btnBuscar);


    body.appendChild(divComercio);
}

generarPrecios();
armarHeader();
armarMain();
// mainLoop()

