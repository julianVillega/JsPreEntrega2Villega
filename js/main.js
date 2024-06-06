// clases:

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
        this.comerciosMarkers = [];
        this.map = L.map('map').setView([-34.92052462063165, -57.94446936030479], 13);
        // Add the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    addComercioMarker(comercio){
        // const marker = L.marker(comercio.latlang);
        const comercioMarker = new ComercioMarker(comercio);
        this.comerciosMarkers.push(comercioMarker);
        comercioMarker.marker.addTo(this.map);
        return comercioMarker;
    }

    mostrarComercios(comercios){
        for(let comercio of comercios){
            const comercioMarker = this.addComercioMarker(comercio);
            comercioMarker.marker.on('click',() => armarVistaDeComercio(comercio))
        }
    }

    quitarMarker(marker){
        this.map.removeLayer(marker);
        this.comerciosMarkers = this.comerciosMarkers.filter(m => m !== marker);
    }

    markerDelComercio(comercio){
        return this.comerciosMarkers.filter(cm => cm.comercio == comercio)[0];
    }
    
}

class ComercioMarker{
    constructor(comercio){
        this.marker = L.marker(comercio.latlang);        
        this.comercio = comercio;
    }
}

// objetos globales:
let comercios = [];
let productos = [];
let precios = [];
//objeto para guardar el mapa de leafleat js
let map;

let configuracionBusquedaEnMapa = {
    tipo : "local",
}

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

// funciones de busqueda
function buscarComercio(nombre){
    return nombre !=="" ? comercios.filter(c => c.nombre.toLowerCase().includes(nombre.toLowerCase())): [];
}

function buscarProducto(nombre){
    return nombre !=="" ? productos.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase())) : [];
}

// funciones de filtrado
function preciosDelProducto(producto){
    return precios.filter(p => p.producto == producto)
}

function preciosDelComercio(comercio){
    // retorna los ultimos precios de los productos vendidos en el comercio pasado como parametro
    let preciosDelComercio = precios.filter(e => e.comercio == comercio);
    //eliminar precios de productos repetidos
    preciosDelComercio.sort((p1,p2) => p1.ean - p2.ean);
    const preciosMasRecientes = {};
    preciosDelComercio.forEach(precio => {
        const ean = precio.producto.ean;
        const fecha = precio.fecha;
        if(!preciosMasRecientes[ean] || fecha > preciosMasRecientes[ean].fecha){
            preciosMasRecientes[ean] = precio;
        }
    })
    return Object.values(preciosMasRecientes);
}

// funciones para cargar datos iniciales de comercios y precios
// para poder probar el sistema
function generarPrecios(){
    // agrego comercios
    agregarComercio(new Comercio("00123654", "Carrefour", "calle 12 nro 123",[-34.92306135547813, -57.94991434646028]))
    agregarComercio(new Comercio("09275654", "Super Lu", "av 60 nro 1200",[-34.92339482939376, -57.944068539651944]))
    agregarComercio(new Comercio("98133654", "El chino", "av 51 nro 456",[-34.92170122221505, -57.94498483514024]))
    agregarComercio(new Comercio("15612367", "Lo de chicho", "Bv Americas nro 846",[-34.92436488977569, -57.94811562618901]))
    agregarComercio(new Comercio("98761452", "Almacen la Gloria", "calle 32 nro 444",[-34.924987645034854, -57.94625914898358]))
    //agrego productos
    agregarProducto(new Producto("1456987","Dulce de leche"));
    agregarProducto(new Producto("9876458","Fideos"));
    agregarProducto(new Producto("7841146","Arroz"));
    agregarProducto(new Producto("3331254","Leche"));
    agregarProducto(new Producto("9546786","Manteca"));
    //genero precios
    //1000ms por segundo, 60 seg por minuto, 60 min por hr, 24hr por dia
    const msPorDia = 1000*60*60*24;
    const fechaFin = new Date();
    const fechaInicio = fechaFin - 30 * msPorDia;
    // Agregamos 5 precios de cada producto en cada comercio
    for(let producto = 0; producto <= 4; producto++){
        for(let comercio = 0; comercio <= 4; comercio++){
            for(let cantidadDePrecios = 0; cantidadDePrecios < 5; cantidadDePrecios ++){
                let fecha = new Date(Math.random()*(fechaFin- fechaInicio) + fechaInicio)
                let valor = Math.random()*1000;
                valor = valor.toFixed(2)
                agregarPrecio(new Precio(productos[producto], valor, comercios[comercio], fecha));
            }
        }
    }
}

// funciones relacionadas al DOM y su aramado:

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
    form.appendChild(inputCheckboxProductos);

    const labelCheckboxLocales = document.createElement("label");
    labelCheckboxLocales.setAttribute("for","checkbox_locales");
    labelCheckboxLocales.innerText = "Buscar locales";
    form.appendChild(labelCheckboxLocales);

    const inputCheckboxLocales = document.createElement("input");
    inputCheckboxLocales.type = "checkbox";
    inputCheckboxLocales.id ="checkbox_locales";
    inputCheckboxLocales.checked = true;
    form.appendChild(inputCheckboxLocales);

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

function armarVistaDeComercio(comercio){
    //muestra la vista de un comercio para poder operar sobre el mismo
    //destacando en color verde el marker del comercio seleccionado.
    const body = document.body;
    
    // cerramos las vistas de los comercios abiertos y volvemos el color del marker a color original.
    document.querySelectorAll(".comercio-div").forEach( c => c.remove());
    document.querySelectorAll(".marker-color-green").forEach( m => {
        m.classList.toggle("marker-color-green");
    })
    // cambiamos el color del marker
    const comercioMarker = map.markerDelComercio(comercio);
    comercioMarker.marker.getElement().classList.toggle("marker-color-green");

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
    btnCerrar.addEventListener('click',() => {
        comercioMarker.marker.getElement().classList.toggle("marker-color-green");
        divComercio.remove();
    });
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

    // tabla de productos y precios
    const divTabla = document.createElement("div");
    divComercio.appendChild(divTabla);

    const tituloTabla = document.createElement("h3");
    tituloTabla.innerText = "Productos:"
    divTabla.appendChild(tituloTabla);

    const tabla = document.createElement("table");
    divComercio.appendChild(tabla);

    const thead = document.createElement('thead');
    tabla.appendChild(thead);

    const encabezadoTabla = document.createElement("tr");
    thead.appendChild(encabezadoTabla);

    const tablaNombre = document.createElement("th");
    tablaNombre.innerText = "Nombre";
    encabezadoTabla.appendChild(tablaNombre);

    const tablaUtimaActualizacion= document.createElement("th");
    tablaUtimaActualizacion.innerText = "Ultima Actualización";
    encabezadoTabla.appendChild(tablaUtimaActualizacion);
    
    const tablaPrecio = document.createElement("th");
    tablaPrecio.innerText = "Precio";
    encabezadoTabla.appendChild(tablaPrecio);

    const tbody = document.createElement('tbody');
    tabla.appendChild(tbody);

    let precios = preciosDelComercio(comercio);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('es-AR', options);
    for(let precio of precios){
        const row = document.createElement('tr');
        row.classList.add("comercio__precio");
        tbody.appendChild(row);
        const colNombre = document.createElement('td');
        colNombre.innerText = precio.producto.nombre;
        row.appendChild(colNombre);
        const colUltimaActualizacion = document.createElement('td');
        colUltimaActualizacion.innerText = formatter.format(precio.fecha);
        // colUltimaActualizacion.innerText = precio.fecha;
        row.appendChild(colUltimaActualizacion);
        const colPrecio = document.createElement('td');
        colPrecio.innerText = precio.valor;
        row.appendChild(colPrecio);
    }
    body.appendChild(divComercio);
}

function armarVistaDeResultadosDeBusqueda(){
    const main = document.querySelector(".main");
    const divResultados = document.createElement("div");
    divResultados.classList.add("main__resultados-busqueda");
    divResultados.classList.add("main__resultados-busqueda--oculto");
    main.appendChild(divResultados);

    const titulo = document.createElement("h3");
    titulo.innerText = "Resultados:";
    titulo.classList.add("main__titulo-resultados-busqueda");
    divResultados.appendChild(titulo);

    const divListaResultados = document.createElement('div');
    divListaResultados.classList.add('main__lista-resultados');
    divResultados.appendChild(divListaResultados);
}

function mostrarResultados(resultados){
    // recibe elementos html y los muestra en el panel de resultados.


    // muestrar el panel de resultados caso este oculto.
    const divResultados = document.querySelector(".main__resultados-busqueda");
    divResultados.classList.remove("main__resultados-busqueda--oculto");
    // quitar los resultados viejos si los hay
    const divListaResultados = document.querySelector(".main__lista-resultados");
    const divsResultados = divListaResultados.childNodes;
    for (let i = divsResultados.length - 1 ; i >= 0; i--){
        divListaResultados.removeChild(divsResultados[i]);
    }
    // console.log(divResultados.childNodes)
    if(resultados.length == 0){
        const sinResultados = document.createElement("h4");
        sinResultados.innerText = "No se encontraron resultados";
        divListaResultados.appendChild(sinResultados);
    }
    else{
        // agregamos los resultados a la lista.
        resultados.forEach(resultado => {
            divListaResultados.appendChild(resultado);
        });
    }

}

// funcion para configurar eventos:

function configurarBusqueda(){
    // configuro los checkbox para buscar por locales/productos:
    let inputCheckboxProductos = document.querySelector("#checkbox_productos");
    let inputCheckboxLocales = document.querySelector("#checkbox_locales");
    inputCheckboxProductos.addEventListener ("change",() => {
        inputCheckboxLocales.checked = false;
        configuracionBusquedaEnMapa.tipo="producto";
    });
    inputCheckboxLocales.addEventListener ("change",() => {
        inputCheckboxProductos.checked = false;
        configuracionBusquedaEnMapa.tipo="local";
    });

    // funcion de busqueda
    let textInput = document.querySelector("#input_busqueda");
    textInput.addEventListener("keyup", () => {
        let resultadosHtml = [];
        if(configuracionBusquedaEnMapa.tipo == "local"){
            resultadosHtml = buscarComercio(textInput.value).map(comercio => {
                const r = document.createElement("div");
                r.classList.add("main__resultado")
                r.innerHTML = `<h4>${comercio.nombre}<\h4> <h4>${comercio.direccion}<\h4>`;
                r.onclick = () => armarVistaDeComercio(comercio);
                return r;
            });
        }
        else{
            resultadosHtml = buscarProducto(textInput.value).map(producto => {
                const r = document.createElement("div");
                r.classList.add("main__resultado")
                r.innerHTML = `<h4>${producto.nombre}<\h4>`;
                return r;
            });
        }
        mostrarResultados(resultadosHtml);
    })
}

generarPrecios();
armarHeader();
armarMain();
armarVistaDeResultadosDeBusqueda();
configurarBusqueda();
// mainLoop()