
export default class Tareas{
    #id;
    #nombre;
    #descripcion;
    #estado;
    #creacion;
    #modificacion;

    constructor(nombre, descripcion, estado, creacion, modificacion){
        this.#id = crypto.randomUUID() 
        this.#nombre = nombre; 
        this.#descripcion = descripcion;
        this.#estado = estado;
        this.#creacion = creacion;
        this.#modificacion = modificacion; 
    }

    // Getters
    get id() {
      return this.#id;
    }

    get nombre() {
      return this.#nombre;
    }

    get descripcion() {
      return this.#descripcion;
    }

    get estado() {
      return this.#estado;
    }

    get creacion() {
      return this.#creacion;
    }

    get modificacion() {
      return this.#modificacion;
    }

    // Setters
    set id(nuevoId) {
      this.#id = nuevoId;
    }

    set nombre(nuevoNombre) {
      this.#nombre = nuevoNombre;
    }

    set descripcion(nuevaDescripcion) {
      this.#descripcion = nuevaDescripcion;
    }

    set estado(nuevoEstado) {
      this.#estado = nuevoEstado;
    }

    set creacion(nuevaCreacion) {
      this.#creacion = nuevaCreacion;
    }    

    set modificacion(nuevaModificacion) {
      this.#modificacion = nuevaModificacion;
    }

  //metodo para almacenar el objeto en el localstorage/sessionstorage

  toJSON(){
    return{
        id: this.id,
        nombre: this.nombre,
        descripcion: this.descripcion,
        estado: this.estado,
        creacion: this.creacion,
        modificacion: this.modificacion
    }
  }
}