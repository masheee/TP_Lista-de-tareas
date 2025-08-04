
import Tareas from "./tareas.js";

// elementos del DOM
const btnAgregarTarea = document.getElementById('btnAgregarTarea');
const modalFormularioTarea = new bootstrap.Modal(document.getElementById('tareaModal'));
const formularioTarea = document.getElementById('formTarea');
const inputNombre = document.getElementById('nombre');
const inputDescripcion = document.getElementById('descripcion');
const inputEstado = document.getElementById('estado');
const tbody = document.querySelector('#tablaTareasBody');
let estoyCreando = true
let idTarea = null
// //verificar si el localstorage tiene tareas, si no tiene hago un array vacio
const listaTareas = JSON.parse(localStorage.getItem('tareasKey')) || [];

// //Funciones
const guardarLocalStorage = ()=>{
  localStorage.setItem('tareasKey', JSON.stringify(listaTareas))
}

const crearTarea = ()=>{
    const ahora = new Date().toLocaleString();    // buscar los datos del formulario y crear un objeto tarea
    const tareaNueva = new Tareas(inputNombre.value, inputDescripcion.value, inputEstado.value, ahora, ahora)
    //guardar la tarea en la lista de tareas
    listaTareas.push(tareaNueva)
    //guardar la lista de tareas en el localstorage
    guardarLocalStorage();
    //mostrar un mensaje al usuario final
    Swal.fire({
    title: "Tarea creada!",
    text: `La tarea "${inputNombre.value}" fue creada correctamente`,    
    imageUrl: "https://preview.redd.it/im-looking-for-an-emoticon-like-this-i-looked-everywhere-v0-edwtnntfxs3e1.png?width=640&crop=smart&auto=webp&s=e951a6cbb6b0282166cf7f5fdc2f288a2c7947f8",
    imageWidth: 400,
    imageHeight: 300,
    imageAlt: "emoji positivo"
    });
    //limpiar el formulario
    limpiarFormulario()
    //dibuje la tarea en la tabla
    dibujarFila(tareaNueva, listaTareas.length)
}

//se vacia el formulario
function limpiarFormulario(){
    formularioTarea.reset()
}

const cargarTarea = ()=>{
    //verificar si tengo tareas para cargar
    tbody.innerHTML = "";
    if(listaTareas.length != 0){
        //recorrer mi lista de tareas y por cada elemento de la lista 
        listaTareas.map((itemTarea, indice)=> dibujarFila(itemTarea, indice+1))
    }else{
        //to do: dibujar un parrafo que diga que no tenemos tareas
        Swal.fire({
        title: "No hay tareas para mostrar",
        imageUrl: "https://png.pngtree.com/png-clipart/20231007/original/pngtree-helpless-emoticon-helpless-picture-image_13100937.png",
        confirmButtonText: "Ok",
    });
    }
    //si tengo, tengo que dibujar las filas en la tabla
}

//se dibuja/maqueta la fila dentro de la tabla
const dibujarFila = (itemTarea, fila)=>{
    tbody.innerHTML += `
            <tr>
              <th scope="row">${fila}</th>
              <td>${itemTarea.nombre}</td>
              <td class="texto-limitado" title="${itemTarea.descripcion}">
                ${itemTarea.descripcion}
              </td>
              <td>${itemTarea.estado}</td>
              <td>${itemTarea.creacion}</td>
              <td>${itemTarea.modificacion}</td>
               <td>
                <button
                  type="button"
                  class="btn btn-info btn-sm me-2 btn-ver-detalle mb-1"
                  onclick="mostrarTarea('${itemTarea.id}')"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-warning btn-sm me-2 btn-editar mb-1"
                  onclick="prepararTarea('${itemTarea.id}')"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm btn-borrar mb-1" onclick="borrarTarea('${itemTarea.id}')">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
    `
}

//agregado de la funcionalidad del boton (mostrarTarea)
window.mostrarTarea = (id) => {
  const tareas = listaTareas.find((tarea) => tarea.id === id);
  if (!tareas) return;

  document.body.innerHTML = `
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container">
          <h4>Detalle de la tarea:</h4>
        </div>
      </nav>
    </header>
    <main class="fondo">
      <div class="card mt-5 container">
        <div class="card-body">
          <p class="text-center"> <----------------------------------------------------------------------------------------------> </p>
          <h2 class="card-title text-center mb-5 mt-5">"${tareas.nombre}"</h2>
          <p class="mb-4 text-center"> <----------------------------------------------------------------------------------------------> </p>
          <p class="card-text text-center mb-4"><strong>Descripcion de la tarea:</strong> ${tareas.descripcion}</p>
          <p class="mb-4 text-center"> <----------------------------------------------------------------------------------------------> </p>
          <p class="card-text text-center mb-4"><strong>Estado de la tarea:</strong> ${tareas.estado}</p>
          <p class="mb-4 text-center"> <----------------------------------------------------------------------------------------------> </p>
          <p class="card-text text-center mb-4"><strong>Fecha de creacion de la tarea:</strong> ${tareas.creacion}</p>
          <p class="mb-4 text-center"> <----------------------------------------------------------------------------------------------> </p>
          <p class="card-text text-center mb-4"><strong>Fecha de la ultima modificacion de la tarea:</strong> ${tareas.modificacion}</p>
          <p class="mb-4 text-center"> <----------------------------------------------------------------------------------------------> </p>
        </div>
        <a href="./index.html" class="btn btn-info mb-4 container w-25">
          <i class="bi bi-arrow-left"></i> Volver a la lista
        </a>
      </div>
    </main>
    <footer class="bg-dark-subtle text-center py-4">
      <p>&copy; Todos los derechos reservados</p>
    </footer>
  `;
};


window.borrarTarea = (id)=>{
  Swal.fire({
  title: "Estas seguro que quieres eliminar la tarea?",
  text: "Los cambios seran permanentes!",
  imageUrl: "https://emojipedia.org/_next/image?url=https%3A%2F%2Fblog.emojipedia.org%2Fcontent%2Fimages%2F2025%2F07%2FEmojipedia-Blog-What-Is-An-Emoji-In-2025.jpg&w=1500&q=75",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Eliminar",
  cancelButtonText: "Cancelar"
}).then((result) => {
  if (result.isConfirmed) {
    //aqui agrego la logica para borrar
    //tengo que buscar en que posicion esta la tarea con el id que quiero borrar
    const indiceTarea = listaTareas.findIndex((tarea)=> tarea.id === id)
    //con splice borramos el elemento de determinada posicion del array
    listaTareas.splice(indiceTarea, 1)
    //actualizar el localStorage
    guardarLocalStorage()
    //actualizar la tabla
    tbody.children[indiceTarea].remove()
    //actualizar el numero de fila del array
    Swal.fire({
    title: "Tarea eliminada!",
    text: "La tarea fue eliminada correctamente",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwQDZC9BNrdWMoACX0xjzPsSD5TsIaIF28UCsZwlBTp1zY3nYidEw4DjcHqZETQv9DOHU&usqp=CAU",
    imageWidth: 400,
    imageHeight: 300,
    imageAlt: "emoji sufriendo"
    });

  }
});
}

window.prepararTarea = (id)=>{
  //cargar los datos de la tarea para que los vea el usuario
  const tareaBuscada = listaTareas.find((tarea)=> tarea.id === id)
  console.log(tareaBuscada)
  //mostrar los datos de la tarea en el form
  inputNombre.value = tareaBuscada.nombre
  inputDescripcion.value = tareaBuscada.descripcion
  inputEstado.value = tareaBuscada.estado
  idTarea = id
  //cambio la variable que controla el crear/editar
  estoyCreando = false
  //abrir el modal
  modalFormularioTarea.show()
}

const editarTarea = ()=>{
  const ahora = new Date().toLocaleString();
  //buscar en que posicion del array est la tarea con ID
  const indiceTarea = listaTareas.findIndex((tarea)=> tarea.id === idTarea)
  //modificar la tarea
  listaTareas[indiceTarea].nombre = inputNombre.value
  listaTareas[indiceTarea].descripcion = inputDescripcion.value
  listaTareas[indiceTarea].estado = inputEstado.value
  listaTareas[indiceTarea].modificacion = ahora
  //actualizar el localStorage
  guardarLocalStorage()
  //actualizar fila de la tabla
  cargarTarea()
  //cerrar el modal
  modalFormularioTarea.hide()

  //todo: mostrar una ventana de sweetAlert para indicar que la tarea fue editada correctamente 
  Swal.fire({
  title: "Cambios guardados!",
  text: "Los cambios se guardaron correctamente",
  imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyKmnLL8pwpE9HoZEoAE5UCl31L6dVMm8HikPZlDZ3VTvpuFjfzI8anQgNqTsBDO2_WDw&usqp=CAU",
  imageWidth: 400,
  imageHeight: 300,
  imageAlt: "Goku de dragon ball z"
  });
  
}


//manejadores de eventos
btnAgregarTarea.addEventListener('click', ()=>{
    limpiarFormulario()
    estoyCreando = true
    modalFormularioTarea.show()
})

formularioTarea.addEventListener('submit', (e)=>{
    e.preventDefault()
    //aqui tengo que crear/editar una tarea
    if(estoyCreando){
      crearTarea()
    }else{
      editarTarea()
    }
})

cargarTarea();



