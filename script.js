document.addEventListener("DOMContentLoaded", () => {
    // ===== Datos (fuente: QS World University Rankings 2027 y QS by Subject 2026: Art & Design) =====
    // Posiciones según columna "Index" de las planillas QS entregadas en clase
    const datos = {
        universidades: { total: 1504, origen: 186, destino: 188 },
        escuelas: { total: 303, origen: 155, destino: 50 },
    };

    const indicadores = {
        universidades: {
            labels: [
                "Reputación académica",
                "Citas por académico",
                "Reputación empleadores",
                "Empleabilidad",
                "Académicos por estudiante",
                "Académicos internacionales",
                "Estudiantes internacionales",
                "Red de investigación",
                "Sostenibilidad",
            ],
            origen: [92.0, 16.0, 85.1, 95.7, 9.9, 10.6, 8.2, 76.8, 66.4],
            destino: [72.7, 5.0, 91.2, 95.0, 65.5, 24.3, 18.5, 75.2, 73.0],
        },
        escuelas: {
            // Art & Design 2026: puntaje = 90% reputación académica + 10% reputación empleadores.
            // Puntaje global U. de Chile (55,1) = cálculo propio; QS no lo publica por estar en banda 151-200.
            labels: ["Reputación académica (90%)", "Reputación empleadores (10%)", "Puntaje global"],
            origen: [52.5, 78.5, 55.1],
            destino: [64.7, 82.7, 66.5],
        },
    };

    // ===== Textos con datos =====
    document.querySelectorAll("[data-dato]").forEach((el) => {
        const [grupo, campo] = el.dataset.dato.split(".");
        el.textContent = datos[grupo][campo];
    });

    // ===== Cuadrículas de ranking =====
    const ranking = (id, { total, origen, destino }) => {
        const min = Math.min(origen, destino);
        const max = Math.max(origen, destino);
        const celdas = Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const clase =
                n === destino ? "destino" : n === origen ? "origen" : n > min && n < max ? "entre" : "";
            return `<span class="${clase}">${n}</span>`;
        });
        document.getElementById(id).innerHTML = celdas.join("");
    };

    ranking("universidades", datos.universidades);
    ranking("escuelas", datos.escuelas);

    // ===== Radares =====
    const estilos = getComputedStyle(document.documentElement);
    const colorOrigen = estilos.getPropertyValue("--color-origen").trim();
    const colorDestino = estilos.getPropertyValue("--color-destino").trim();

    const radar = (id, { labels, origen, destino }) =>
        new Chart(document.getElementById(id), {
            type: "radar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Universidad de Chile",
                        data: origen,
                        borderColor: colorOrigen,
                        backgroundColor: "rgba(0, 0, 255, 0.1)",
                        pointBackgroundColor: colorOrigen,
                    },
                    {
                        label: "Tecnológico de Monterrey",
                        data: destino,
                        borderColor: colorDestino,
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        pointBackgroundColor: colorDestino,
                    },
                ],
            },
            options: {
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 25, backdropColor: "transparent" },
                        pointLabels: { font: { family: "Bricolage Grotesque", size: 11 } },
                    },
                },
                plugins: {
                    legend: { position: "bottom", labels: { font: { family: "Bricolage Grotesque" } } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} / 100`,
                        },
                    },
                },
            },
        });

    radar("comparaUniversidades", indicadores.universidades);
    radar("comparaEscuelas", indicadores.escuelas);

    // ===== Mapa =====
    const origen = [-33.4422, -70.638017]; // FAU, Universidad de Chile
    const destino = [25.6514, -100.2895]; // Campus Monterrey, Av. Eugenio Garza Sada 2501 Sur (por verificar)

    const map = L.map("map");

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16, attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ" }
    ).addTo(map);

    L.marker(origen)
        .addTo(map)
        .bindPopup("<b>Universidad de Chile</b><br />Facultad de Arquitectura y Urbanismo.");

    L.marker(destino)
        .addTo(map)
        .bindPopup("<b>Tecnológico de Monterrey</b><br />Escuela de Arquitectura, Arte y Diseño, Campus Monterrey.")
        .openPopup();

    L.polyline([origen, destino], { color: colorDestino, weight: 1.5, dashArray: "4 6" }).addTo(map);

    map.fitBounds([origen, destino], { padding: [40, 40] });
});
// ===== Infografía interactiva: proceso de intercambio nivel FAU =====
document.addEventListener("DOMContentLoaded", () => {
    const svg = document.getElementById("infografia");
    if (!svg) return;

    // Contenido de cada etapa (fuente: Movilidad FAU)
    const pasosInfo = [
        {
            etiqueta: "PASO 1 · REQUISITOS",
            titulo: "Antes de postular",
            desc: [
                "Comprueba que cumples las condiciones académicas",
                "y administrativas indicadas en la convocatoria vigente.",
            ],
        },
        {
            etiqueta: "PASO 2 · DOCUMENTACIÓN",
            titulo: "Prepara tus antecedentes",
            desc: [
                "Completa el formulario y reúne los documentos",
                "solicitados. Revisa los formatos y plazos de entrega.",
            ],
        },
        {
            etiqueta: "PASO 3 · SELECCIÓN",
            titulo: "Evaluación de postulaciones",
            desc: [
                "La FAU revisa los antecedentes y realiza la selección",
                "de estudiantes según los criterios establecidos",
                "en la convocatoria.",
            ],
        },
        {
            etiqueta: "PASO 4 · ADJUDICACIÓN",
            titulo: "Confirma tu cupo",
            desc: [
                "Recibe el resultado y acepta o rechaza el cupo",
                "asignado dentro del plazo informado por la FAU.",
            ],
        },
        {
            etiqueta: "PASO 5 · ADMISIÓN",
            titulo: "Postulación al destino",
            desc: [
                "Completa el proceso de admisión de la universidad",
                "de destino y espera la confirmación oficial.",
            ],
        },
    ];

    const NS = "http://www.w3.org/2000/svg";
    const pasos = [...svg.querySelectorAll(".paso")];
    const textos = svg.querySelector("#det-textos");
    const etiqueta = svg.querySelector("#det-etiqueta");
    const titulo = svg.querySelector("#det-titulo");
    const desc = svg.querySelector("#det-desc");
    const contador = svg.querySelector("#info-contador");
    const progreso = svg.querySelector("#info-progreso");
    const anterior = svg.querySelector("#info-anterior");
    const siguiente = svg.querySelector("#info-siguiente");

    let actual = 0;

    const mostrar = (i) => {
        actual = Math.max(0, Math.min(pasosInfo.length - 1, i));
        const paso = pasosInfo[actual];

        // Estado visual de cada etapa: activa, completada o pendiente
        pasos.forEach((g, n) => {
            g.classList.toggle("activo", n === actual);
            g.classList.toggle("completado", n < actual);
            g.setAttribute("aria-pressed", n === actual);
        });

        // Panel de detalle
        etiqueta.textContent = paso.etiqueta;
        titulo.textContent = paso.titulo;
        desc.replaceChildren(
            ...paso.desc.map((linea, n) => {
                const tspan = document.createElementNS(NS, "tspan");
                tspan.setAttribute("x", "55");
                tspan.setAttribute("dy", n === 0 ? "0" : "26");
                tspan.textContent = linea;
                return tspan;
            })
        );
        textos.classList.remove("det-anim");
        textos.getBoundingClientRect(); // reinicia la animación
        textos.classList.add("det-anim");

        // Barra de avance y navegación
        contador.textContent = `${actual + 1} / ${pasosInfo.length}`;
        progreso.setAttribute("y2", 300 + actual * 100);
        anterior.classList.toggle("desactivado", actual === 0);
        siguiente.classList.toggle("desactivado", actual === pasosInfo.length - 1);
    };

    // Clic y teclado (Enter o espacio)
    const activar = (el, accion) => {
        el.addEventListener("click", accion);
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                accion();
            }
        });
    };

    pasos.forEach((g, n) => activar(g, () => mostrar(n)));
    activar(anterior, () => mostrar(actual - 1));
    activar(siguiente, () => mostrar(actual + 1));

    mostrar(0);
});
