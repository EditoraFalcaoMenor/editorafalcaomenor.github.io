
async function setupSaveButton() {
    const button = document.querySelector("#save-to-list");

    if (!button) {
        console.error("Botão de salvar não encontrado.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const workSlug = params.get("work");

    if (!workSlug) {
        button.disabled = true;
        return;
    }

    try {
        const works = await loadWorks();

        const work = works.find(item => item.slug === workSlug);

        if (!work) {
            throw new Error("Obra não encontrada.");
        }

        const icon = button.querySelector("img");

        // Atualizar ícone conforme o estado da obra
        function updateButton() {
            const saved = isWorkSaved(work.slug);

            icon.src = saved
                ? "../assets/icon-dark/bookmark-fill.svg"
                : "../assets/icon-dark/bookmark.svg";

            button.setAttribute(
                "aria-label",
                saved
                    ? "Remover da Minha Lista"
                    : "Salvar na Minha Lista"
            );

            button.setAttribute("aria-pressed", String(saved));
        }

        updateButton();

        // Salvar ou remover
        button.addEventListener("click", () => {
            toggleSavedWork(work.slug);
            updateButton();
        });

    } catch (error) {
        console.error("Erro ao configurar lista:", error);
        button.disabled = true;
    }
}

setupSaveButton();
