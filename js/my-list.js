
async function atualizarMinhaLista() {
    const container = document.querySelector("#my-list");
    const counter = document.querySelector("#saved-count");

    try {
        const works = await loadWorks();
        const savedSlugs = getSavedWorks();

        // Recuperar os dados completos das obras salvas
        const savedWorks = savedSlugs
            .map(slug => works.find(work => work.slug === slug))
            .filter(work => work !== undefined);

        // Atualizar contador
        counter.textContent = savedWorks.length;

        container.replaceChildren();

        // Lista vazia
        if (savedWorks.length === 0) {
            container.textContent = "Sua lista está vazia.";
            return;
        }

        savedWorks.forEach(work => {
            const item = document.createElement("article");
            item.className = "my-list_item";

            // Card da obra
            const card = createWorkCard(work);

            // Botão remover
            const removeButton = document.createElement("button");

            removeButton.type = "button";
            removeButton.className = "btn btn_my-list btn--outlined";
            removeButton.setAttribute("aria-label", `Remover ${work.title}`);

            const removeIcon = document.createElement("img");

            removeIcon.src = "../assets/icon-dark/remove.svg";
            removeIcon.alt = "";
            removeIcon.className = "btn_svg";

            removeButton.appendChild(removeIcon);

            removeButton.addEventListener("click", () => {
                toggleSavedWork(work.slug);
                atualizarMinhaLista();
            });

            item.append(card, removeButton);

            container.appendChild(item);
        });

    } catch (error) {
        console.error("Erro ao carregar Minha Lista:", error);
        container.textContent = "Não foi possível carregar sua lista.";
    }
}

atualizarMinhaLista();
