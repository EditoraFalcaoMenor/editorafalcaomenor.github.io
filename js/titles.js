
let allWorks = [];
let currentGenre = "Todas";


// Transformar o gênero em um nome mais legível
function formatGenre(genre) {
    return genre
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


// Criar os filtros automaticamente
function montarFiltros() {
    const container = document.querySelector("#genre-filters");

    // Encontrar todos os gêneros cadastrados
    const genres = [
        ...new Set(
            allWorks.flatMap(work =>
                work.classification?.genres || []
            )
        )
    ].sort();

    const categories = ["Todas", ...genres];

    container.replaceChildren();

    categories.forEach(genre => {
        const button = document.createElement("button");

        button.className = "genre-filter";
        button.textContent = genre === "Todas"
            ? "Todas"
            : formatGenre(genre);

        if (genre === currentGenre) {
            button.classList.add("ativo");
        }

        button.addEventListener("click", () => {
            filtrar(genre);
        });

        container.appendChild(button);
    });
}


// Filtrar as obras
function filtrar(genre) {
    currentGenre = genre;

    montarFiltros();
    mostrarVitrine();
}


// Mostrar as obras na página
function mostrarVitrine() {
    const container = document.querySelector("#works-grid");

    container.replaceChildren();

    const filteredWorks = currentGenre === "Todas"
        ? allWorks
        : allWorks.filter(work =>
            work.classification?.genres?.includes(currentGenre)
        );

    if (filteredWorks.length === 0) {
        container.textContent = "Nenhuma obra encontrada.";
        return;
    }

    filteredWorks.forEach(work => {
        container.appendChild(createWorkCardTitles(work));
    });
}


// Inicializar catálogo
async function loadCatalog() {
    try {
        allWorks = await loadWorks();

        montarFiltros();
        mostrarVitrine();

    } catch (error) {
        console.error("Erro ao carregar catálogo:", error);

        document.querySelector("#works-grid").textContent =
            "Não foi possível carregar os títulos.";
    }
}

loadCatalog();
