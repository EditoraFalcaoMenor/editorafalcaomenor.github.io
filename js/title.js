async function loadReader() {
    const params = new URLSearchParams(window.location.search);
    const workSlug = params.get("work");

    try {
        const response = await fetch("/json/works.json");

        if (!response.ok) {
            throw new Error("Erro ao carregar JSON.");
        }

        const content = await response.json();

        const work = content.works.find(
            item => item.slug === workSlug
        );

        if (!work) {
            throw new Error("Obra não encontrada.");
        }

        // Aplicar tema aos elementos específicos
        const themeElements = document.querySelectorAll(
            ".cover-group-title, .tabs_panel "
        );

        themeElements.forEach(element => {
            element.classList.add(work.theme);
        });

        renderReader(work);

    } catch (error) {
        console.error("Erro ao carregar obra:", error);

        document.querySelectorAll(
            ".in-nav_favicon-title, .work-title"
        ).forEach(element => {
            element.textContent = "Obra não encontrada.";
        });
    }
}

function renderReader(work) {

    // Título
    document.querySelectorAll(
        ".in-nav_favicon-title, .work-title"
    ).forEach(element => {
        element.textContent = work.title;
    });

    // Capa
    const cover = document.querySelector(".lt-title-cover_img");

    if (cover) {
        cover.src = work.images?.img_cover?.src || "";
        cover.alt = `Capa de ${work.title}`;
    }

    // Descrição
    document.querySelector(".work-description").textContent =
        work.description || "Descrição não disponível.";

    // Data de lançamento
    const releaseDate = document.querySelector(".work-release-date");

    if (work.releaseDate) {
        const date = new Date(work.releaseDate + "T00:00:00");
        releaseDate.textContent = date.toLocaleDateString("pt-BR");
    } else {
        releaseDate.textContent = "Não informada.";
    }

    // Status
    const status = document.querySelector(".work-status");

    const statusNames = {
        soon: "Em breve",
        ongoing: "Em andamento",
        completed: "Concluída",
        hiatus: "Em hiato",
        cancelled: "Cancelada"
    };

    status.textContent =
        statusNames[work.status] || work.status || "Não informado.";

    // Gêneros
    const genres = document.querySelector(".work-genres");

    const genreNames = {
        drama: "Drama",
        "slice-of-life": "Cotidiano",
        fantasy: "Fantasia",
        romance: "Romance",
        comedy: "Comédia",
        adventure: "Aventura"
    };

    genres.textContent = work.classification?.genres?.length
        ? work.classification.genres
            .map(genre => genreNames[genre] || genre)
            .join(", ")
        : "Não informado.";
}

loadReader();