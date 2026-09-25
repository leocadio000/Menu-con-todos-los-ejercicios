// Estructura de la asignatura INF-5170 (UASD) sin Evaluación General
const menuUASD = [
  {
    titulo: "Práctica 0. Arquitectura Web",
    items: [
      { titulo: "Opinión sobre el material de estudio de Arquitectura de Aplicaciones Web", tipo: "pdf", url: "docs/Opinión sobre el material de estudio de Arquitectura de Aplicaciones Web.pdf"}
    ]
  },
  {
    titulo: "Práctica No. 1. HTML",
    items: [
      { titulo: "Crear una Página Web Personal en HTML", url: "https://leocadio000.github.io/Pagina-Personal1/" }
    ]
  },
  {
    titulo: "Práctica 2. HTML Continuación",
    items: [
      { titulo: "Biografía (con foto) y Horario de Clases en formato tabla", url: "https://leocadio000.github.io/Bibliografia/" },
      { titulo: "Crear una página web que muestre 102 Etiquetas HTML", url: "https://leocadio000.github.io/Guia-completa-de-102-etiquetas/" }
    ]
  },
  {
    titulo: "Práctica 3. HTML5 / CSS",
    items: [
      { titulo: "Página Web Banco XX (Estructura Banreservas)", url: "https://leocadio000.github.io/banco/" }
    ]
  },
  {
    titulo: "Práctica 4. Menú dinámico con estructuras de datos",
    items: [
      { titulo: "Crear menú dinámico utilizando una estructura de datos: JSON, XML o GraphQL", url: "https://leocadio000.github.io/menu-dinamico/" }
    ]
  },
  {
    titulo: "Práctica 5. Pruebas Modernas para Aplicaciones Web y APIs",
    items: [
      { titulo: "Práctica 5.1. Pruebas Automatizadas de UI y API con Playwright o Cypress", url: "https://leocadio000.github.io/Biblioteca-uasd/" },
      { titulo: "Práctica 5.2. Pruebas BDD con Gherkin", url: "https://leocadio000.github.io/Pruebas-BDD-con-Gherkin/" },
      { titulo: "Práctica 5.3. Pruebas de Performance con JMeter, k6 o Postman", url: "https://leocadio000.github.io/Pruebas-de-Performance-con-JMeter-k6-o-Postman/" }
    ]
  },
  {
    titulo: "Práctica 6. XML / JSON",
    items: [
      { titulo: "AREA 1: Realizar un resumen de XML y su uso. Coloque ejemplo (PDF)", tipo: "pdf", url: "docs/practica6_area1_xml.pdf" },
      { titulo: "TAREA 2: Realizar un resumen de JSON y su uso. Coloque ejemplo (PDF)", tipo: "pdf", url: "docs/practica6_area2_json.pdf" },
      { titulo: "TAREA 3: Realizar un resumen de AJAX. Coloque ejemplo de funcionamiento (PDF)", tipo: "pdf", url: "docs/practica6_area3_ajax.pdf" }
    ]
  },
  {
    titulo: "Práctica 7. Acceso a Base de Datos",
    items: [
      { titulo: "Crear un Formulario con Acceso a BD", url: "https://leocadio000.github.io/Crear-un-Formulario-con-Acceso-a-BD/" }
    ]
  },
  {
    titulo: "Práctica 8. Modelo MVC",
    items: [
      { titulo: "MVC en el desarrollo web moderno: origen, evolución y uso actual (PDF)", tipo: "pdf", url: "docs/Investigacion MVC Desarrollo Web Moderno.pdf" }
    ]
  },
  {
    titulo: "Práctica 9. Servicios Web",
    items: [
      { titulo: "Desarrollar un Servicio Web para validar la cédula usando el módulo 10", url: "https://leocadio000.github.io/validador-cedula-dominicana/" }
    ]
  },
  {
    titulo: "Práctica 10. Framework de desarrollo / Control de Versiones",
    items: [
      { titulo: "Spring Framework - Describir las funcionalidades de este Framework", url: "docs/Trabajo_Spring_Framework.pdf" }
    ]
  },
  {
    titulo: "PROYECTO FINAL",
    items: [
      { titulo: "PROYECTO FINAL [OBLIGATORIO - DISPONIBLE DESDE INICIO DEL SEMESTRE]", url: "https://leocadio000.github.io/chatbot/" }
    ]
  }
];

// Generar el menú dinámico en la barra lateral
document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menu-container");

  if (menuContainer) {
    menuContainer.innerHTML = "";

    menuUASD.forEach((grupo) => {
      if (grupo.items.length > 1) {
        const details = document.createElement("details");
        details.style.marginBottom = "8px";

        const summary = document.createElement("summary");
        summary.className = "btn";
        summary.style.cursor = "pointer";
        summary.style.listStyle = "none";
        summary.style.display = "flex";
        summary.style.justifyContent = "space-between";
        summary.style.alignItems = "center";
        summary.innerHTML = `<span>${grupo.titulo}</span> <span>▼</span>`;

        const subContainer = document.createElement("div");
        subContainer.style.paddingLeft = "10px";
        subContainer.style.marginTop = "4px";

        grupo.items.forEach((item) => {
          const subBoton = document.createElement("button");
          subBoton.className = "btn";
          subBoton.style.width = "100%";
          subBoton.style.marginBottom = "4px";
          subBoton.style.fontSize = "12px";
          subBoton.style.background = "#334155";
          subBoton.style.textAlign = "left";
          subBoton.textContent = item.titulo;
          subBoton.onclick = () => cargarRecurso(item.titulo, item.url, item.tipo);
          subContainer.appendChild(subBoton);
        });

        details.appendChild(summary);
        details.appendChild(subContainer);
        menuContainer.appendChild(details);
      } else {
        const item = grupo.items[0];
        const boton = document.createElement("button");
        boton.className = "btn";
        boton.style.width = "100%";
        boton.style.marginBottom = "8px";
        boton.style.textAlign = "left";
        boton.textContent = grupo.titulo;
        boton.onclick = () => cargarRecurso(item.titulo, item.url, item.tipo);
        menuContainer.appendChild(boton);
      }
    });
  }
});

// Función para cargar contenido en la ventana central
function cargarRecurso(titulo, url, tipo) {
  const contenedor = document.getElementById("contenido-dinamico");

  if (!contenedor) return;

  contenedor.innerHTML = `
    <h2>${titulo}</h2>
    <hr><br>
    <div style="margin-bottom: 12px; display: flex; gap: 15px;">
      <a href="${url}" target="_blank" class="btn" style="padding: 6px 12px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px; font-size: 13px;">
        🔗 Abrir en Pestaña Nueva / Repositorio
      </a>
    </div>
    <iframe src="${url}" style="width: 100%; height: 600px; border: 1px solid #cbd5e1; border-radius: 8px;"></iframe>
  `;
}

function logout() {
  window.location.href = "login.html";
}