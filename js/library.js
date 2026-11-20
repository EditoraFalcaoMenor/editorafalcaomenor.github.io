
const WORKS_URL = './json/works.json';

// Carregar todas as obras
async function loadWorks() {
    const response = await fetch(WORKS_URL);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as obras.");
    }

    const content = await response.json();

    return content.works;
}
// async function loadWorks() {
//     console.time("Carregamento das obras");

//     try {
//         const response = await fetch("/json/works.json");

//         if (!response.ok) {
//             throw new Error("Não foi possível carregar as obras.");
//         }

//         const content = await response.json();

//         console.timeEnd("Carregamento das obras");

//         return content.works;

//     } catch (error) {
//         console.timeEnd("Carregamento das obras");
//         console.error(error);
//         throw error;
//     }
// }


// Recuperar os slugs salvos no navegador
function getSavedWorks() {
    try {
        return JSON.parse(localStorage.getItem("my-list")) || [];
    } catch (error) {
        console.error("Erro ao recuperar Minha Lista:", error);
        return [];
    }
}


// Adicionar ou remover uma obra da lista
function toggleSavedWork(slug) {
    let savedWorks = getSavedWorks();

    const index = savedWorks.indexOf(slug);

    if (index === -1) {
        savedWorks.push(slug);
    } else {
        savedWorks.splice(index, 1);
    }

    localStorage.setItem("my-list", JSON.stringify(savedWorks));

    return index === -1;
}


// Verificar se uma obra está salva
function isWorkSaved(slug) {
    return getSavedWorks().includes(slug);
}


// Criar card de uma obra
function createWorkCard(work) {
    const article = document.createElement("article");
    article.className = "work-card";

    const link = document.createElement("a");
    link.className = "work-card_link";
    link.href = `/title/?work=${encodeURIComponent(work.slug)}`;

    const cover = document.createElement("img");
    cover.className = "work-card_cover";
    cover.src = work.images?.img_cover?.src || "";
    cover.alt = `Capa de ${work.title}`;
    cover.loading = "lazy";

    const title = document.createElement("h3");
    title.className = "work-card_title";
    title.textContent = work.title;

    link.append(cover, title);
    article.appendChild(link);

    return article;
}


// Criar card de uma obra em Titles
function createWorkCardTitles(work) {
    const article = document.createElement("article");
    article.className = "work-card--titles";

    const link = document.createElement("a");
    link.className = "work-card_link--titles";
    link.href = `/title/?work=${encodeURIComponent(work.slug)}`;

    const cover = document.createElement("img");
    cover.className = "work-card_cover";
    cover.src = work.images?.img_cover?.src || "";
    cover.alt = `Capa de ${work.title}`;
    cover.loading = "lazy";

    const title = document.createElement("p");
    title.className = "work-card_title--titles";
    title.textContent = work.title;

    link.append(cover, title);
    article.appendChild(link);

    return article;
}
