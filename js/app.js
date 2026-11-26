const API_URL = "http://vivero.atwebpages.com/api";
const form = document.getElementById("form-planta");
const tabla = document.getElementById("tabla-plantas");
const totalPlantas = document.getElementById("total-plantas");
const inputId = document.getElementById("planta-id");
const inputNombre = document.getElementById("nombre");
const inputTipo = document.getElementById("tipo");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const btnGuardar = document.getElementById("btn-guardar");
const iconoGuardar = document.getElementById("icono-guardar");
const textoGuardar = document.getElementById("texto-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const tituloFormulario = document.getElementById("titulo-formulario");

const ICONO_GUARDAR = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
`;

const ICONO_ACTUALIZAR = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
        <path d="M16 16h5v5"></path>
    </svg>
`;

const ICONO_EDITAR = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
`;

const ICONO_ELIMINAR = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
    </svg>
`;

document.addEventListener("DOMContentLoaded", seleccionarTodo);

async function seleccionarTodo() {
    try {
        const respuesta = await fetch(`${API_URL}/seleccionarTodo.php`);
        const resultado = await respuesta.json();

        tabla.innerHTML = "";

        if (resultado.status === "success") {
            const lista = resultado.data || [];
            totalPlantas.textContent = `${lista.length} ${lista.length === 1 ? "planta" : "plantas"}`;

            if (lista.length === 0) {
                tabla.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted py-4">Sin plantas registradas todavía</td>
                    </tr>
                `;
                return;
            }

            lista.forEach((planta) => {
                const stockNum = parseInt(planta.stock, 10);
                let claseStock = "";
                if (stockNum === 0) claseStock = "stock-sin";
                else if (stockNum <= 5) claseStock = "stock-poco";

                tabla.innerHTML += `
                    <tr>
                        <td class="text-muted">${planta.id}</td>
                        <td class="fw-semibold">${planta.nombre}</td>
                        <td><span class="etiqueta-tipo">${planta.tipo}</span></td>
                        <td class="precio-texto">$${parseFloat(planta.precio).toFixed(2)}</td>
                        <td class="${claseStock}">${stockNum}</td>
                        <td class="text-end">
                            <button type="button" class="btn btn-warning btn-accion d-inline-flex align-items-center gap-1 me-1" onclick="seleccionarUno(${planta.id})">
                                ${ICONO_EDITAR}
                                <span>Editar</span>
                            </button>
                            <button type="button" class="btn btn-danger btn-accion d-inline-flex align-items-center gap-1" onclick="eliminarRegistro(${planta.id})">
                                ${ICONO_ELIMINAR}
                                <span>Eliminar</span>
                            </button>
                        </td>
                    </tr>
                `;
            });
        } else {
            Swal.fire("Aviso", resultado.mensaje || "No se pudieron cargar las plantas", "warning");
        }
    } catch (error) {
        console.error("Error en seleccionarTodo:", error);
        Swal.fire("Error", "No se pudo conectar con seleccionarTodo.php", "error");
    }
}

async function seleccionarUno(id) {
    try {
        const respuesta = await fetch(`${API_URL}/seleccionar.php?id=${id}`);
        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            const planta = resultado.data;
            inputId.value = planta.id;
            inputNombre.value = planta.nombre;
            inputTipo.value = planta.tipo;
            inputPrecio.value = planta.precio;
            inputStock.value = planta.stock;

            tituloFormulario.textContent = `Editar planta #${planta.id}`;
            iconoGuardar.innerHTML = ICONO_ACTUALIZAR;
            textoGuardar.textContent = "Actualizar";
            btnGuardar.classList.remove("btn-verde");
            btnGuardar.classList.add("btn-naranja");
            btnCancelar.classList.remove("d-none");
        } else {
            Swal.fire("Aviso", resultado.mensaje, "warning");
        }
    } catch (error) {
        console.error("Error en seleccionarUno:", error);
        Swal.fire("Error", "No se pudo consultar la planta", "error");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = inputId.value.trim();
    const datos = {
        id: id,
        nombre: inputNombre.value.trim(),
        tipo: inputTipo.value,
        precio: parseFloat(inputPrecio.value),
        stock: parseInt(inputStock.value, 10)
    };

    const endpoint = id ? `${API_URL}/actualizar.php` : `${API_URL}/agregar.php`;

    try {
        const respuesta = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (resultado.status === "success") {
            await Swal.fire({
                icon: "success",
                title: "¡Listo!",
                text: resultado.mensaje,
                timer: 1400,
                showConfirmButton: false
            });
            resetearFormulario();
            seleccionarTodo();
        } else {
            Swal.fire("Error", resultado.mensaje, "error");
        }
    } catch (error) {
        console.error("Error al guardar/actualizar:", error);
        Swal.fire("Error", "No se pudo completar la operación con el servidor", "error");
    }
});

async function eliminarRegistro(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar planta?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (confirmacion.isConfirmed) {
        try {
            const respuesta = await fetch(`${API_URL}/eliminar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            });

            const resultado = await respuesta.json();

            if (resultado.status === "success") {
                await Swal.fire("Eliminada", resultado.mensaje, "success");
                seleccionarTodo();
            } else {
                Swal.fire("Error", resultado.mensaje, "error");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            Swal.fire("Error", "No se pudo eliminar la planta", "error");
        }
    }
}

btnCancelar.addEventListener("click", resetearFormulario);

function resetearFormulario() {
    form.reset();
    inputId.value = "";
    tituloFormulario.textContent = "Nueva planta";
    iconoGuardar.innerHTML = ICONO_GUARDAR;
    textoGuardar.textContent = "Guardar";
    btnGuardar.classList.remove("btn-naranja");
    btnGuardar.classList.add("btn-verde");
    btnCancelar.classList.add("d-none");
}