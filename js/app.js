// Campos del formulrio
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// User interface UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor() {
        this.citas = [];
    };

    agregarCita(cita) {
        this.citas= [...this.citas, cita];        
    };

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    };

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    };
};

class UI {
    imprimirAlerta(mensaje, tipo){
        //  Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase al tipo de error
        if(tipo == 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        };

        // mensaje de error
        divMensaje.textContent = mensaje;

        // Agergar al DOM

        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta despues de 5 seg
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    };

    imprimirCitas({citas}) {

        this.limpiarHTML();

        citas.forEach (cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //  Scripting de los elementos de las citas
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class = "font-weight-bolder">Propietario:</span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class = "font-weight-bolder">Telefono:</span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class = "font-weight-bolder">Fecha:</span> ${fecha}
            `;
            
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class = "font-weight-bolder">Hora:</span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class = "font-weight-bolder">Sintomas:</span> ${sintomas}
            `;

            // Añade un boton para eliminar citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML= 'Eliminar';
            btnEliminar.onclick = () => eliminarCita(id);

            // Añade un boton para editar cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML= 'Editar';
            btnEditar.onclick = () => cargarEdicion(cita);

            // agergar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar citas en HTML
            contenedorCitas.appendChild(divCita);
        });
    };

    limpiarHTML() {
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        };
    };
};

const ui = new UI();
const administrarCitas = new Citas();

// Registrar eventos
eventListener();
function eventListener() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
};

// Objeto con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
};

// Agrega datos al objeto de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
    
    console.log(citaObj);
};

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    // Extraer la informacion del Objeto cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    };

    if(editando) {
        ui.imprimirAlerta('Se Editó Correctamente');

        // pasar el objeto de la cita a edicion
        administrarCitas.editarCita({...citaObj})

        // Regresar el texto del boton a su estado original
        formulario.querySelector('button[type = "submit').textContent = 'Crear Cita';

        // Quitar modo edicion
        editando = false;

    } else {
        // generar un id unico
        citaObj.id = Date.now();
        // Creando una nuvea cita
        administrarCitas.agregarCita({...citaObj});
        // imprimir mensaje de agregadoi correctamnente
        ui.imprimirAlerta('Se Agrego Correctamente');
    };
    


    // reiniciar el objeto para la validacion
    reiniciarObjeto();
    
    // reiniciar fromulario
    formulario.reset();

    // mostrar el HTML
    ui.imprimirCitas(administrarCitas);
};

function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
};

function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id);
    // Muestre mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');
    // Refrescar las citas
    ui.imprimirCitas(administrarCitas);
};

// Carga los datos y el modo edicion
function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Se llenan los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //  cambiar el texto del boton
    formulario.querySelector('button[type = "submit').textContent = 'Guardar Cambios';

    editando = true;
}