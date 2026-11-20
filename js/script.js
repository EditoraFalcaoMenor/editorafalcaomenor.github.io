document.addEventListener("DOMContentLoaded", () => {

    // 1. Header scroll effect
    const headers = document.querySelectorAll(".nav");


    if (headers.length > 0) {
        window.addEventListener("scroll", () => {
            const currentScroll = window.scrollY;

            headers.forEach(header => {
                // Pega o limite do HTML (data-scroll-threshold) ou usa 80 por padrão
                const threshold = header.dataset.scrollThreshold ? Number(header.dataset.scrollThreshold) : 80;

                // Pega a classe customizada ou usa a padrão 'nav--scrolled'
                const scrollClass = header.dataset.scrollClass || "nav--scrolled";

                // Verifica se passou do limite daquele elemento específico
                const isScrolled = currentScroll > threshold;
                header.classList.toggle(scrollClass, isScrolled);
            });
        });
    }



    window.share = function () {
        const canonical = document.querySelector("link[rel=canonical]");
        const url = canonical ? canonical.href : window.location.href;

        const metaText = document.querySelector('meta[name="share-text"]');
        const text = metaText ? metaText.content : "Veja isso:";

        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: text,
                url: url
            }).catch((error) => console.log('Erro ao compartilhar:', error));
        } else {
            alert("Compartilhamento não suportado neste navegador ou ambiente.");
        }
    };

    // Vincula o evento ao botão logo que o script carrega (dentro do seu DOMContentLoaded)
    const shareButton = document.getElementById("share-btn");
    if (shareButton) {
        shareButton.addEventListener("click", window.share);
    }

    // 2. Dropdown Menus (Múltiplos)
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
        const toggleButton = dropdown.querySelector("[data-dropdown-toggle]");
        const dropdownMenu = dropdown.querySelector("[data-dropdown-menu]");

        if (toggleButton && dropdownMenu) {
            // Alterna a visibilidade ao clicar no botão
            toggleButton.addEventListener("click", (event) => {
                event.stopPropagation();

                // Opcional: fecha outros dropdowns abertos antes de abrir o atual
                document.querySelectorAll("[data-dropdown-menu]").forEach((menu) => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove("dropdown-menu--open");
                    }
                });

                dropdownMenu.classList.toggle("dropdown-menu--open");
            });

            // Fecha o menu ao clicar fora dele
            document.addEventListener("click", (event) => {
                if (!dropdown.contains(event.target)) {
                    dropdownMenu.classList.remove("dropdown-menu--open");
                }
            });

            // Fecha o menu ao rolar a página
            window.addEventListener("scroll", () => {
                dropdownMenu.classList.remove("dropdown-menu--open");
            }, { passive: true });
        }
    });

    // 3. Debug Button (Protegido caso não exista na página)
    const btn = document.getElementById('debug-btn');
    if (btn) {
        let debugActive = false;
        btn.addEventListener('click', () => {
            debugActive = !debugActive;
            let styleTag = document.getElementById('debug-mode-style');

            if (debugActive) {
                if (!styleTag) {
                    styleTag = document.createElement('style');
                    styleTag.id = 'debug-mode-style';
                    styleTag.innerHTML = '* { outline: 1px solid red !important; }';
                    document.head.appendChild(styleTag);
                }
                btn.textContent = 'Desativar Modo Debug';
            } else {
                if (styleTag) styleTag.remove();
                btn.textContent = 'Ativar Modo Debug';
            }
        });
    }

    // 4. Tabs (Corrigido e integrado diretamente no DOMContentLoaded)
    const tabsContainers = document.querySelectorAll("[data-tabs]");

    if (tabsContainers.length > 0) {
        tabsContainers.forEach((container) => {
            const buttons = Array.from(container.querySelectorAll(".tabs_button"));
            const panels = Array.from(container.querySelectorAll(".tabs_panel"));
            const contentContainer = container.querySelector(".tabs_content-container");

            if (buttons.length === 0 || panels.length === 0) return;

            function switchTab(targetTab, shouldScroll = false) {
                if (!targetTab) return;

                buttons.forEach((btn) => {
                    const isActive = btn.dataset.tab === targetTab;
                    btn.classList.toggle("tabs_button--active", isActive);
                    btn.setAttribute("aria-selected", isActive ? "true" : "false");
                    btn.setAttribute("tabindex", isActive ? "0" : "-1");
                });

                panels.forEach((panel) => {
                    const isActive = panel.dataset.content === targetTab;
                    panel.classList.toggle("tabs_panel--active", isActive);
                    if (isActive) {
                        panel.removeAttribute("hidden");
                    } else {
                        panel.setAttribute("hidden", "");
                    }
                });

                if (shouldScroll && contentContainer) {
                    const navPosition = contentContainer.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: navPosition - 120, behavior: "smooth" });
                }
            }

            function openTabFromHash() {
                const hash = window.location.hash.slice(1);
                if (!hash) return;
                const targetButton = buttons.find((btn) => btn.dataset.tab === hash);
                if (targetButton) switchTab(hash, false);
            }

            buttons.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    if (btn.dataset.tab) switchTab(btn.dataset.tab, true);
                });

                btn.addEventListener("keydown", (e) => {
                    let targetIndex = null;
                    if (e.key === "ArrowRight") targetIndex = (index + 1) % buttons.length;
                    else if (e.key === "ArrowLeft") targetIndex = (index - 1 + buttons.length) % buttons.length;

                    if (targetIndex !== null && buttons[targetIndex]) {
                        buttons[targetIndex].focus();
                        if (buttons[targetIndex].dataset.tab) {
                            switchTab(buttons[targetIndex].dataset.tab, false);
                        }
                    }
                });
            });

            openTabFromHash();
            window.addEventListener("hashchange", openTabFromHash);
        });

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") return;

                const targetTab = href.slice(1);
                for (const container of tabsContainers) {
                    const targetButton = Array.from(container.querySelectorAll(".tabs_button"))
                        .find((btn) => btn.dataset.tab === targetTab);

                    if (targetButton) {
                        e.preventDefault();
                        targetButton.click();
                        break;
                    }
                }
            });
        });
    }

    // 5. Botão Voltar ao Topo
    const botaoTopo = document.getElementById("btnVoltarTopo");
    if (botaoTopo) {
        botaoTopo.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 6. Exibir episodios pagina title
    async function loadEpisodes() {
        const params = new URLSearchParams(window.location.search);
        const workSlug = params.get("work");

        const episodeList = document.querySelector("#episode-list");

        try {
            // Busca o conteúdo do JSON
            const response = await fetch("/json/works.json");

            if (!response.ok) {
                throw new Error("Não foi possível carregar o conteúdo.");
            }

            const content = await response.json();

            // Encontra a obra pelo slug
            const work = content.works.find(
                item => item.slug === workSlug
            );

            if (!work) {
                episodeList.textContent = "Obra não encontrada.";
                return;
            }

            // Limpa a lista antes de adicionar os episódios
            episodeList.innerHTML = "";

            // Ordena os episódios por temporada e número
            const episodes = [...work.episodes].sort((a, b) => {
                return a.season - b.season || a.number - b.number;
            });

            if (episodes.length === 0) {
                episodeList.textContent = "Nenhum episódio disponível.";
                return;
            }

            // Cria cada episódio
            episodes.forEach(episode => {
                const isAvailable = episode.status === true;

                const chapter = document.createElement("article");
                chapter.className = "content_chapters";

                // Botão de identificação do episódio
                const iconLink = document.createElement("span");
                iconLink.className = "btn content_btn";

                const icon = document.createElement("img");
                icon.src = "../../assets/icon-dark/news.svg";
                icon.alt = "";

                iconLink.appendChild(icon);

                // Descrição do episódio
                const description = document.createElement("div");
                description.className = "content_description";

                const title = document.createElement("h3");
                title.className = "p_title";
                title.textContent =
                    `T${episode.season}:E${episode.number}: ${episode.title}`;

                const text = document.createElement("p");
                text.className = "p_description";
                text.textContent = episode.description;

                description.append(title, text);

                // Link para acessar o episódio
                const readerLink = document.createElement("a");
                readerLink.className = "btn content_btn";

                const arrow = document.createElement("img");
                arrow.src = "../../assets/icon-dark/arrow_forward_ios.svg";
                arrow.alt = "";

                readerLink.appendChild(arrow);

                if (isAvailable) {
                    const query = new URLSearchParams({
                        work: work.slug,
                        episode: episode.slug
                    });

                    readerLink.href = `/leitor/index.html?${query}`;
                    readerLink.setAttribute(
                        "aria-label",
                        `Ler ${title.textContent}`
                    );
                } else {
                    readerLink.classList.add("btn--disabled");
                    readerLink.setAttribute("aria-disabled", "true");
                    readerLink.removeAttribute("href");
                }

                chapter.append(iconLink, description, readerLink);

                episodeList.appendChild(chapter);
            });

        } catch (error) {
            console.error("Erro ao carregar episódios:", error);
            episodeList.textContent = "Não foi possível carregar os episódios.";
        }
    }

    loadEpisodes();
});