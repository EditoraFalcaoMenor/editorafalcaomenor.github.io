document.addEventListener("DOMContentLoaded", () => {

    // 1. Header scroll effect
    const headers = document.querySelectorAll(".nav-for-scroll");
    if (headers.length > 0) {
        window.addEventListener("scroll", () => {
            const isScrolled = window.scrollY > 80;
            headers.forEach(header => {
                header.classList.toggle("nav--scrolled", isScrolled);
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

    // 2. Dropdown Menu
    const toggleButton = document.querySelector("[data-dropdown-toggle]");
    const dropdownMenu = document.querySelector("[data-dropdown-menu]");

    if (toggleButton && dropdownMenu) {
        toggleButton.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("dropdown-menu--open");
        });

        document.addEventListener("click", (event) => {
            if (!dropdownMenu.contains(event.target) && !toggleButton.contains(event.target)) {
                dropdownMenu.classList.remove("dropdown-menu--open");
            }
        });

        window.addEventListener("scroll", () => {
            dropdownMenu.classList.remove("dropdown-menu--open");
        }, { passive: true });
    }

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
});