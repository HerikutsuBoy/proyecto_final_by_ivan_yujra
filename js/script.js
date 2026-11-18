/* ===== SIMTELE-WEB · script.js =====
   ESTRUCTURA PARA EXPLICAR: 0) Utilidades  1) Detención  2) Mantenimiento
   3) Viento  4) Sensores. Cada módulo: leer datos -> validar -> procesar -> mostrar en el DOM. */

// ---------- 0. UTILIDADES ----------
// EXPLICAR: atajo para no repetir document.getElementById
const $ = (id) => document.getElementById(id);

// EXPLICAR: función reutilizable que muestra un mensaje (tipo: "ok", "alerta" o "error")
function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensaje " + tipo; // la clase CSS cambia el color
}

// EXPLICAR: un valor es válido si NO está vacío y es número (acepta coma decimal)
function leerNumero(texto) {
  const limpio = texto.trim().replace(",", ".");
  if (limpio === "") return NaN;
  return Number(limpio);
}

// EXPLICAR: localStorage (opcional) guarda los arreglos en el navegador como texto JSON
function guardar(clave, arreglo) { localStorage.setItem(clave, JSON.stringify(arreglo)); }
function cargar(clave) { return JSON.parse(localStorage.getItem(clave)) || []; }

// ---------- 1. DETENCIÓN DE EMERGENCIA ----------
const UMBRAL_DISTANCIA = 50; // metros (valor ficticio, solo didáctico)

function calcularDetencion(evento) {
  evento.preventDefault(); // EXPLICAR: evita que el formulario recargue la página
  const salida = $("msg-detencion");
  const v = leerNumero($("velocidad").value);
  const t = leerNumero($("reaccion").value);

  // Validaciones: vacío / no numérico, y rangos
  if (isNaN(v) || isNaN(t)) {
    mostrarMensaje(salida, "Error: ingresa solo números en ambos campos (no pueden estar vacíos).", "error");
    return;
  }
  if (v < 1 || v > 100 || t < 0.1 || t > 20) {
    mostrarMensaje(salida, "Error: velocidad entre 1 y 100 km/h, tiempo entre 0.1 y 20 s.", "error");
    return;
  }

  const distancia = (v / 3.6) * t; // fórmula del desafío
  const texto = "Distancia durante la reacción: " + distancia.toFixed(1) + " m. ";

  // EXPLICAR: if / else con el umbral ficticio
  if (distancia >= UMBRAL_DISTANCIA) {
    mostrarMensaje(salida, texto + "ALERTA (simulada): supera el umbral de " + UMBRAL_DISTANCIA + " m.", "alerta");
  } else {
    mostrarMensaje(salida, texto + "Dentro del umbral didáctico de " + UMBRAL_DISTANCIA + " m.", "ok");
  }
}

// ---------- 2. MANTENIMIENTO ----------
// EXPLICAR: arreglo de OBJETOS, cada registro = { componente, horas, estado }
let componentes = cargar("simtele-componentes");

function agregarComponente(evento) {
  evento.preventDefault();
  const salida = $("msg-mantenimiento");
  const nombre = $("componente").value.trim();
  const horas = leerNumero($("horas").value);

  if (nombre === "") { mostrarMensaje(salida, "Error: escribe el nombre del componente.", "error"); return; }
  if (isNaN(horas) || horas < 0) { mostrarMensaje(salida, "Error: las horas deben ser un número mayor o igual a 0.", "error"); return; }

  componentes.push({ componente: nombre, horas: horas, estado: $("estado").value }); // alta con push
  guardar("simtele-componentes", componentes);
  $("form-mantenimiento").reset();
  mostrarMensaje(salida, "Registro agregado correctamente.", "ok");
  dibujarMantenimiento();
}

// EXPLICAR: recorre el arreglo y crea una fila <tr> por cada objeto (así se actualiza el DOM)
function dibujarMantenimiento() {
  const cuerpo = $("tabla-mantenimiento");
  cuerpo.innerHTML = "";
  componentes.forEach(function (item, indice) {
    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td></td><td></td>" +
      '<td><span class="etiqueta ' + item.estado + '">' + item.estado + "</span></td>" +
      '<td><button class="eliminar" data-indice="' + indice + '">Eliminar</button></td>';
    fila.children[0].textContent = item.componente; // textContent evita insertar HTML malicioso
    fila.children[1].textContent = item.horas;
    cuerpo.appendChild(fila);
  });
  $("cuenta-mantenimiento").textContent = componentes.length;
}

// EXPLICAR: un solo evento en la tabla detecta qué botón "Eliminar" se pulsó; splice borra 1 elemento
function eliminarComponente(evento) {
  if (evento.target.classList.contains("eliminar")) {
    componentes.splice(Number(evento.target.dataset.indice), 1);
    guardar("simtele-componentes", componentes);
    mostrarMensaje($("msg-mantenimiento"), "Registro eliminado.", "ok");
    dibujarMantenimiento();
  }
}

// ---------- 3. VIENTO Y OSCILACIÓN ----------
function analizarViento(evento) {
  evento.preventDefault();
  const salida = $("msg-viento");
  const campos = document.querySelectorAll(".viento-input");
  const mediciones = []; // EXPLICAR: arreglo de números

  for (let i = 0; i < campos.length; i++) {
    const valor = leerNumero(campos[i].value);
    if (isNaN(valor) || valor < 0) {
      mostrarMensaje(salida, "Error: la medición " + (i + 1) + " está vacía o no es un número válido (≥ 0).", "error");
      return;
    }
    mediciones.push(valor);
  }

  // EXPLICAR: for para sumar y buscar el máximo
  let suma = 0;
  let maximo = mediciones[0];
  for (let i = 0; i < mediciones.length; i++) {
    suma += mediciones[i];
    if (mediciones[i] > maximo) maximo = mediciones[i];
  }
  const promedio = suma / mediciones.length;

  // Clasificación didáctica por umbrales
  let clase, tipo;
  if (promedio < 20) { clase = "Calma"; tipo = "ok"; }
  else if (promedio < 40) { clase = "Moderado"; tipo = "alerta"; }
  else { clase = "Fuerte"; tipo = "error"; }

  mostrarMensaje(salida, "Promedio: " + promedio.toFixed(1) + " km/h · Máximo: " + maximo + " km/h · Clasificación (simulada): " + clase, tipo);
}

// ---------- 4. SENSORES ----------
const REGEX_CODIGO = /^SEN-\d{3}$/; // EXPLICAR: ^ inicio, SEN- literal, \d{3} tres dígitos, $ fin
let sensores = cargar("simtele-sensores");

function registrarSensor(evento) {
  evento.preventDefault();
  const salida = $("msg-sensores");
  const codigo = $("codigo").value.trim();
  const lectura = leerNumero($("lectura").value);

  if (codigo === "") { mostrarMensaje(salida, "Error: el código está vacío.", "error"); return; }
  if (!REGEX_CODIGO.test(codigo)) { mostrarMensaje(salida, "Error: código inválido. Usa el formato SEN-001.", "error"); return; } // test() devuelve true/false
  if (isNaN(lectura)) { mostrarMensaje(salida, "Error: la lectura está vacía o no es numérica.", "error"); return; }

  sensores.push({ codigo: codigo, tipo: $("tipo").value, lectura: lectura });
  guardar("simtele-sensores", sensores);
  $("form-sensores").reset();
  mostrarMensaje(salida, "Sensor " + codigo + " registrado (válido).", "ok");
  dibujarSensores();
}

function dibujarSensores() {
  const cuerpo = $("tabla-sensores");
  cuerpo.innerHTML = "";
  sensores.forEach(function (s, indice) {
    const fila = document.createElement("tr");
    fila.innerHTML = "<td></td><td></td><td></td>" +
      '<td><button class="eliminar" data-indice="' + indice + '">Eliminar</button></td>';
    fila.children[0].textContent = s.codigo;
    fila.children[1].textContent = s.tipo;
    fila.children[2].textContent = s.lectura;
    cuerpo.appendChild(fila);
  });
}

function eliminarSensor(evento) {
  if (evento.target.classList.contains("eliminar")) {
    sensores.splice(Number(evento.target.dataset.indice), 1);
    guardar("simtele-sensores", sensores);
    dibujarSensores();
  }
}

// ---------- DATOS DE PRUEBA (solo rellenan los campos; tú pulsas el botón principal) ----------
function cargarPruebaDetencion() { $("velocidad").value = "72"; $("reaccion").value = "3"; }
function cargarPruebaMantenimiento() {
  const n = componentes.length + 1;
  $("componente").value = "Componente " + n; $("horas").value = 100 * n; $("estado").value = "normal";
}
function cargarPruebaViento() {
  const datos = [10, 20, 30, 40, 50];
  document.querySelectorAll(".viento-input").forEach(function (campo, i) { campo.value = datos[i]; });
}
function cargarPruebaSensores() { $("codigo").value = "SEN-001"; $("tipo").value = "Viento"; $("lectura").value = "25.5"; }

// ---------- EVENTOS (EXPLICAR: addEventListener conecta cada botón/formulario con su función) ----------
$("form-detencion").addEventListener("submit", calcularDetencion);
$("form-mantenimiento").addEventListener("submit", agregarComponente);
$("tabla-mantenimiento").addEventListener("click", eliminarComponente);
$("form-viento").addEventListener("submit", analizarViento);
$("form-sensores").addEventListener("submit", registrarSensor);
$("tabla-sensores").addEventListener("click", eliminarSensor);

$("prueba-detencion").addEventListener("click", cargarPruebaDetencion);
$("prueba-mantenimiento").addEventListener("click", cargarPruebaMantenimiento);
$("prueba-viento").addEventListener("click", cargarPruebaViento);
$("prueba-sensores").addEventListener("click", cargarPruebaSensores);

// Al abrir la página, dibuja lo que haya guardado (localStorage)
dibujarMantenimiento();
dibujarSensores();


/* =====================================
   NAVEGACIÓN DE LA PÁGINA DE INICIO
===================================== */

(() => {

  const pantallaInicio = document.getElementById("inicio");
  const panelPrincipal = document.getElementById("panel-principal");

  const botonEntrar = document.getElementById("btn-entrar");
  const botonInicio = document.getElementById("btn-inicio");

  // Comprobar que los elementos existan
  if (!pantallaInicio || !panelPrincipal ||
      !botonEntrar || !botonInicio) {
    return;
  }

  // INGRESAR AL SISTEMA
  botonEntrar.addEventListener("click", () => {

    pantallaInicio.hidden = true;
    panelPrincipal.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

  // REGRESAR A LA PANTALLA DE INICIO
  botonInicio.addEventListener("click", () => {

    panelPrincipal.hidden = true;
    pantallaInicio.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

})();

