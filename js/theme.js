(() => {
            const root = document.documentElement;
            const modes = ['system', 'light', 'dark'];
            const labels = { system: '🖥️ Sistema', light: '☀️ Claro', dark: '🌙 Escuro' };
            const get = () => { try { return localStorage.getItem('theme') || 'system'; } catch { return 'system'; } };

            const apply = (mode) => {
                mode === 'system' ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', mode);
                document.querySelectorAll('[data-theme-toggle]').forEach(b => {
                    b.textContent = labels[mode];
                    b.setAttribute('aria-label', 'Tema: ' + labels[mode]);
                });
            };

            apply(get()); // aplica o tema antes do body existir
            document.addEventListener('DOMContentLoaded', () => apply(get())); // atualiza o texto do botão

            document.addEventListener('click', (e) => {
                if (!e.target.closest('[data-theme-toggle]')) return;
                const next = modes[(modes.indexOf(get()) + 1) % modes.length];
                try { localStorage.setItem('theme', next); } catch { }
                apply(next);
            });
        })();