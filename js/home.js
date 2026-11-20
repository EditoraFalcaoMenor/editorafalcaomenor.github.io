
async function loadFeaturedWorks() {

    const container = document.querySelector("#meu-scroll");

    // Slugs das cinco obras escolhidas
    const featuredSlugs = [
        "livro-arte-volume-1-ainda-estou-aqui",
        "encontros",
        "urso",
        "ferretto",
        "ferretto"
    ];

    try {

        const works = await loadWorks();

        // Selecionar as obras na ordem definida acima
        const featuredWorks = featuredSlugs
            .map(slug => works.find(work => work.slug === slug))
            .filter(work => work !== undefined);

        // Criar os elementos
        const elements = [];

        // Primeiro elemento fantasma
        // const firstGhost = document.createElement("div");
        // firstGhost.className = "card-ghost";
        // elements.push(firstGhost);

        // Criar os cards
        featuredWorks.forEach((work, index) => {

            const card = document.createElement("div");
            card.className = "card";

            const link = document.createElement("a");

            link.href = `/title/?work=${encodeURIComponent(work.slug)}`;

            // Capa
            const image = document.createElement("img");

            image.src = work.images?.img_cover?.src || "";
            image.alt = `Capa de ${work.title}`;

            // Título
            const title = document.createElement("p");

            title.textContent = work.title;

            // Contador
            const counter = document.createElement("p");

            counter.className = "card-counter";
            counter.textContent = `${index + 1}/${featuredWorks.length}`;

            // Montar card
            link.append(image, title, counter);

            card.appendChild(link);

            elements.push(card);

        });

        // Último elemento fantasma
        const lastGhost = document.createElement("div");
        lastGhost.className = "card-ghost";

        elements.push(lastGhost);

        // Inserir tudo na seção
        container.replaceChildren(...elements);

    } catch (error) {

        console.error("Erro ao carregar obras em destaque:", error);

        container.textContent = "Não foi possível carregar as obras.";

    }
}

loadFeaturedWorks();

// Salvar em qual obra de destaque está

const elementoScroll = document.getElementById("meu-scroll");

if (elementoScroll) {
    // Salva a posição sempre que o usuário rolar
    elementoScroll.addEventListener("scroll", () => {
        localStorage.setItem("posicao-scroll", elementoScroll.scrollLeft);
    });
}
if (elementoScroll) {
    const posicaoSalva = localStorage.getItem("posicao-scroll");
    if (posicaoSalva) {
        elementoScroll.scrollLeft = parseInt(posicaoSalva, 10);
    }
}

// Verificação formulario
const form = document.getElementById('form');
const name = document.getElementById('iname');
const bday = document.getElementById('ibday');
const email = document.getElementById('iemail');
const message = document.getElementById('message');

form.addEventListener('submit', function (event) {

    event.preventDefault();

    // Verificação do nome
    if (name.value.trim().length < 3) {
        message.textContent = 'Digite um nome válido.';
        return;
    }

    // Verificação da data de nascimento
    const birthDate = new Date(bday.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate >= today || !bday.value) {
        message.textContent = 'Digite uma data de nascimento válida.';
        return;
    }

    // Verificação do email
    if (!email.checkValidity()) {
        message.textContent = 'Digite um email válido.';
        return;
    }

    // Se todas as verificações forem aprovadas
    message.textContent = 'Formulário enviado com sucesso!';

});

// Limpar mensagens ao reiniciar o formulário
form.addEventListener('reset', function () {
    message.textContent = '';
});