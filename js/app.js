
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
// //verificar si el localstorage tiene contactos, si no tiene hago un array vacio
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
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Eliminar",
  cancelButtonText: "Cancelar"
}).then((result) => {
  if (result.isConfirmed) {
    //aqui agrego la logica para borrar
    //tengo que buscar en que posicion esta el contacto con el id que quiero borrar
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
      icon: "success"
    });

  }
});
}

window.prepararTarea = (id)=>{
  //cargar los datos del contacto para que los vea el usuario
  const tareaBuscada = listaTareas.find((tarea)=> tarea.id === id)
  console.log(tareaBuscada)
  //mostrar los datos del contacto en el form
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
  //buscar en que posicion del array est el contacto con ID
  const indiceTarea = listaTareas.findIndex((tarea)=> tarea.id === idTarea)
  //modificar el contacto
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

  
}


//manejadores de eventos
btnAgregarTarea.addEventListener('click', ()=>{
    limpiarFormulario()
    estoyCreando = true
    modalFormularioTarea.show()
})

formularioTarea.addEventListener('submit', (e)=>{
    e.preventDefault()
    //aqui tengo que crear/editar un contacto
    if(estoyCreando){
      crearTarea()
    }else{
      editarTarea()
    }
})

cargarTarea();

