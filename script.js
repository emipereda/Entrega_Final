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
