# SIMTELE-WEB

Panel interactivo educativo de prevención y monitoreo de un sistema de transporte por cable (inspirado en Mi Teleférico). Proyecto del desafío de **Programación Web I**.

> ⚠️ Todos los umbrales son **didácticos (simulaciones)**, nunca límites operativos reales.

## Integrantes

- Ivan Yujra

## Enlaces

- Página publicada: _(https://herikutsuboy.github.io/proyecto_final_by_ivan_yujra/)_
- Repositorio: _(https://github.com/HerikutsuBoy/proyecto_final_by_ivan_yujra/tree/main)_

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura semántica (header, nav, main, section, footer) |
| `styles.css` | Estilos propios y diseño adaptable a celular (media query) |
| `script.js` | Lógica: funciones, eventos, DOM, arreglos y expresión regular |
| `README.md` | Documentación |

## Módulos

1. **Detención de emergencia:** calcula `d = (v / 3.6) × t` y muestra una alerta si supera un umbral ficticio de 50 m.
2. **Mantenimiento:** agrega y elimina registros (componente, horas, estado) en una tabla dinámica.
3. **Viento y oscilación:** 5 mediciones → promedio, máximo y clasificación didáctica.
4. **Sensores:** valida el código con la expresión regular `/^SEN-\d{3}$/`, la lectura numérica y muestra los registros válidos.

Extra: los registros de mantenimiento y sensores se conservan al recargar (`localStorage`).

## Instrucciones de uso

1. Abre la página (o `index.html` en el navegador).
2. Usa el menú superior para ir a cada módulo.
3. Completa el formulario y pulsa el botón principal de cada módulo. El botón **"Cargar datos de prueba"** rellena los campos con los valores de las pruebas.
4. En las tablas, pulsa **Eliminar** para borrar un registro.

## Requisitos técnicos mínimos
 
- HTML semántico: `header`, `nav`, `main`, `section`, `footer`; formularios con `label` y mensajes de ayuda.
- CSS propio: colores coherentes, tablas y botones con estilo, diseño adaptable a celular con media query.
- JavaScript externo (`script.js`): más de 4 funciones propias, eventos con `addEventListener` y actualización del DOM sin recargar.
- Arreglos: mantenimiento (objetos), sensores (objetos) y viento (números); altas, visualización y eliminación de registros.
- Expresión regular real `/^SEN-\d{3}$/` y validaciones de rangos, vacíos y valores no numéricos, con mensajes claros.
- Opcional: `localStorage` para conservar registros al recargar.
## Pruebas de aceptación
 
| Módulo | Entrada | Resultado esperado |
|---|---|---|
| Detención | 72 km/h y 3 s | 60 m |
| Mantenimiento | agregar 2 componentes y eliminar 1 | 2 filas, luego 1 fila |
| Viento | 10, 20, 30, 40, 50 | promedio 30, máximo 50 |
| Sensores | `SEN-001` / `SEN-1` / vacío | válido / error / error |
| Navegación | menú y controles en pantalla pequeña | funcionan |
