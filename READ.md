primary-tab
Secondary-tabs

tabs_filled-button: 

tabs_primary--line
tabs_primary--color

tabs_secondary--line
tabs_secondary--color


button Heights
small: 34px (path mention)
medium: 45px (nav, tabs)
xmedium: 50px (buttons)


CRIAÇÃO DE CLASSES CSS (exemplos)

.bloco
.bloco_elemento
.bloco_elemento--modificador



NOMEAÇÃO DE MODIFICADOR - Escala Relativa

Abreviação	Significado	Quando usar
xs	extra small	menor variante disponível
sm	small	pequeno
70 md	medium	tamanho medio, aceitavel
80 lg	large	grande
90 xl	extra large	tamanho "padrão"/base
2xl, 3xl...	2x extra large, etc	quando precisar ir além de xl (raro, mas aparece em ícones, hero images, etc)

- Escala Absoluta/especial
full 
auto
none



Organização e Ordenação arq. CSS

style.css
├── 1. :root (tokens)
├── 2. Reset/base (html, body, *, a, botão)
├── 3. Layout (nav, section, footer — estrutura geral)
├── 4. Componentes (.button, .tab, .menu, .container)
└── 5. Utilitários (.container--filled, .img--lg, modificadores soltos)


<!-- para o title.json -->

img_cover
img_back-cover
img_banner-1x1
img_background
