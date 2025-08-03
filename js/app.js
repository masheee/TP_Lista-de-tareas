
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
    console.log('aqui tengo que crear el contacto')
    // todo Agregar validaciones
    // buscar los datos del formulario y crear un objeto contacto
    const tareaNueva = new Tareas(inputNombre.value, inputDescripcion.value, inputEstado.value)
    //guardar el contacto en la agenda de contactos
    listaTareas.push(tareaNueva)
    console.log(tareaNueva)
    //guardar la agenda en el localstorage
    guardarLocalStorage();
    //mostrar un mensaje al usuario final
    Swal.fire({
        title: "Tarea creada!",
        text: `La tarea ${inputNombre.value} fue creada correctamente`,
        icon: "success",
        confirmButtonText: "Ok",
    });
    //limpiar el formulario
    limpiarFormulario()
    //dibuje el contacto en la tabla
    dibujarFila(tareaNueva, listaTareas.length)
}

function limpiarFormulario(){
    formularioTarea.reset()
}

const cargarTarea = ()=>{
    //verificar si tengo contactos para cargar
    tbody.innerHTML = "";
    if(listaTareas.length != 0){
        //recorrer mi agenda y por cada elemento de la agenda 
        listaTareas.map((itemTarea, indice)=> dibujarFila(itemTarea, indice+1))
    }else{
        //to do: dibujar un parrafo que diga que no tenemos contactos
    }
    //si tengo, tengo que dibujar las filas en la tabla
}

const dibujarFila = (itemTarea, fila)=>{
    tbody.innerHTML += `
            <tr>
              <th scope="row">${fila}</th>
              <td>${itemTarea.nombre}</td>
              <td>${itemTarea.descripcion}</td>
              <td>${itemTarea.estado}</td>
              <td>${itemTarea.estado}</td>
              <td>${itemTarea.estado}</td>
               <td>
                <button
                  type="button"
                  class="btn btn-info btn-sm me-2 btn-ver-detalle"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-warning btn-sm me-2 btn-editar"
                  onclick="prepararTarea('${itemTarea.id}')"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm btn-borrar" onclick="borrarTarea('${itemTarea.id}')">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
    `
}

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

    // Swal.fire({
    //   title: "Tarea eliminada!",
    //   text: "La tarea fue eliminada correctamente",
    //   icon: "success"
    // });

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
  //cambio la variable que control el crear/editar
  estoyCreando = false
  //abrir el modal
  modalFormularioTarea.show()
}

const editarTarea = ()=>{
  console.log('tengo que editar')
  //buscar en que posicion del array est la tarea con ID
  const indiceTarea = listaTareas.findIndex((tarea)=> tarea.id === idTarea)
  //modificar la tarea
  listaTareas[indiceTarea].nombre = inputNombre.value
  listaTareas[indiceTarea].descripcion = inputDescripcion.value
  listaTareas[indiceTarea].estado = inputEstado.value
  //actualizar el localStorage
  guardarLocalStorage()
  //actualizar fila de la tabla
  cargarTarea()
  //cerrar el modal
  modalFormularioTarea.hide()

  //todo: mostrar una ventana de sweetAlert para indicar que elcontacto fue editado correctamente 
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

