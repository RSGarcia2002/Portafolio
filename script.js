const projects = [
  {
    name: "Golampi Compiler",
    repo: "golampi-compiler",
    description:
      "Compilador para el lenguaje Golampi con interfaz web, analisis lexico, sintactico y semantico, manejo de funciones, arreglos y generacion de codigo ARM64.",
    tags: ["PHP", "ANTLR4", "ARM64", "Compiladores"],
    date: "Actualizado en 2026",
    url: "https://github.com/RSGarcia2002/golampi-compiler",
    accent: "#0f766e",
  },
  {
    name: "EXTREAMFS Proyecto 2",
    repo: "MIA_1S2026_P2_202202123",
    description:
      "Simulador EXT2/EXT3 en C++ con discos, particiones, usuarios, permisos, journaling, reportes, API HTTP y despliegue cloud con S3 y EC2.",
    tags: ["C++", "CMake", "AWS", "Sistemas de archivos"],
    date: "Actualizado en 2026",
    url: "https://github.com/RSGarcia2002/MIA_1S2026_P2_202202123",
    accent: "#2764b0",
  },
  {
    name: "EXTREAMFS Proyecto 1",
    repo: "MIA_1S2026_P1_202202123",
    description:
      "Sistema de archivos EXT2 simulado con interprete de comandos, administracion de discos virtuales, particiones, sesiones y reportes graficos.",
    tags: ["C++", "React", "Vite", "Graphviz"],
    date: "Actualizado en 2026",
    url: "https://github.com/RSGarcia2002/MIA_1S2026_P1_202202123",
    accent: "#d95d39",
  },
  {
    name: "Golampi Interpreter",
    repo: "OLC2-Proyecto1-Golampi",
    description:
      "Interprete para Golampi usando ANTLR4 y PHP, con editor web, ejecucion de codigo, consola, errores por linea y columna, tabla de simbolos y reportes.",
    tags: ["PHP", "ANTLR4", "JavaScript", "Lenguajes"],
    date: "Actualizado en 2026",
    url: "https://github.com/RSGarcia2002/OLC2-Proyecto1-Golampi",
    accent: "#d99a22",
  },
  {
    name: "Cotizador Web",
    repo: "cotizador-web",
    description:
      "Aplicacion web para cotizacion de multiservicios con backend en Python y una interfaz en HTML/CSS enfocada en operaciones de negocio.",
    tags: ["Python", "HTML", "CSS", "Web app"],
    date: "Actualizado en 2026",
    url: "https://github.com/RSGarcia2002/cotizador-web",
    accent: "#5b5f97",
  },
  {
    name: "IPC2 Proyecto 2",
    repo: "IPC2_Proyecto2_202202123",
    description:
      "Proyecto en Python con interfaz HTML que refuerza fundamentos de backend, manejo de datos y construccion de soluciones academicas completas.",
    tags: ["Python", "HTML", "Backend"],
    date: "Actualizado en 2025",
    url: "https://github.com/RSGarcia2002/IPC2_Proyecto2_202202123",
    accent: "#2f855a",
  },
  {
    name: "Practicas Iniciales",
    repo: "PRAINIC_RANDALLGARCIA_202202123",
    description:
      "Repositorio con reportes tecnicos y recursos practicos sobre mantenimiento, instalacion de Kali Linux y cableado de red.",
    tags: ["TypeScript", "JavaScript", "Documentacion"],
    date: "Actualizado en 2025",
    url: "https://github.com/RSGarcia2002/PRAINIC_RANDALLGARCIA_202202123",
    accent: "#8a5a44",
  },
  {
    name: "Estructuras de Datos",
    repo: "-EDD-1S2025_202202123",
    description:
      "Proyecto academico en Pascal centrado en logica, estructuras de datos y resolucion ordenada de problemas desde fundamentos de programacion.",
    tags: ["Pascal", "Estructuras", "Algoritmos"],
    date: "Actualizado en 2025",
    url: "https://github.com/RSGarcia2002/-EDD-1S2025_202202123",
    accent: "#7c3aed",
  },
];

const projectGrid = document.querySelector("#projectGrid");

projectGrid.innerHTML = projects
  .map((project) => {
    const initials = project.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("");

    const tags = project.tags.map((tag) => `<span>${tag}</span>`).join("");

    return `
      <article class="project-card" style="--accent: ${project.accent}">
        <div class="project-topline">
          <div>
            <span class="project-icon">${initials}</span>
          </div>
          <span class="project-date">${project.date}</span>
        </div>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-footer">
          <span class="project-date">${project.repo}</span>
          <a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">Ver repositorio</a>
        </div>
      </article>
    `;
  })
  .join("");
