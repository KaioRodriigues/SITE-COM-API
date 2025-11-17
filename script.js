// ===================================
// VARIÁVEIS GLOBAIS
// ===================================

let currentPage = 1;
let allCharacters = [];
let filteredCharacters = [];

// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const charactersContainer = document.getElementById('charactersContainer');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// ===================================
// FUNÇÃO PRINCIPAL - BUSCAR PERSONAGENS
// ===================================

/**
 */
async function fetchCharacters(page = 1) {
    try {
        // Mostrar loading, esconder erro
        showLoading();
        hideError();

        // Construir URL da API com número da página
        const url = `https://rickandmortyapi.com/api/character?page=${page}`;

        // Fazer requisição HTTP
        console.log(`Buscando dados da página ${page}...`);
        const response = await fetch(url);

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        // Converter resposta para JSON
        const data = await response.json();

        // Armazenar dados e renderizar
        allCharacters = data.results;
        currentPage = page;
        filteredCharacters = allCharacters;

        console.log(`✓ ${allCharacters.length} personagens carregados`);

        // Renderizar cards
        renderCharacters(filteredCharacters);

        // Mostrar paginação
        showPagination();

        // Esconder loading
        hideLoading();

    } catch (error) {
        // Tratar erro
        console.error('Erro ao buscar dados:', error);
        showError(error.message);
        hideLoading();
    }
}

// ===================================
// FUNÇÃO - RENDERIZAR CARDS
// ===================================

/**
 * Renderiza os cards dos personagens no DOM
 */
function renderCharacters(characters) {
    // Limpar container
    charactersContainer.innerHTML = '';

    // Verificar se há personagens
    if (characters.length === 0) {
        charactersContainer.innerHTML = `
            <div class="empty-state">
                <p>Nenhum personagem encontrado</p>
            </div>
        `;
        return;
    }

    // Criar card para cada personagem
    characters.forEach(character => {
        // Criar elemento div para o card
        const card = document.createElement('div');
        card.className = 'character-card';

        // Determinar classe de status
        let statusClass = 'status-unknown';
        if (character.status === 'Alive') {
            statusClass = 'status-alive';
        } else if (character.status === 'Dead') {
            statusClass = 'status-dead';
        }

        // Preencher conteúdo do card com HTML
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${character.image}" alt="${character.name}" class="card-image">
                <div class="card-image-overlay"></div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${character.name}</h3>
                <div class="card-info">
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="status-badge ${statusClass}">${character.status}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Espécie:</span>
                        <span class="info-value">${character.species}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Gênero:</span>
                        <span class="info-value">${character.gender}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Origem:</span>
                        <span class="info-value">${character.origin.name}</span>
                    </div>
                </div>
                <div class="card-footer">
                    Aparições: ${character.episode.length} episódios
                </div>
            </div>
        `;

        // Adicionar card ao container
        charactersContainer.appendChild(card);
    });
}

// ===================================
// FUNÇÃO - FILTRAR PERSONAGENS
// ===================================

/**
 * Filtra personagens pelo termo de busca
 */
function filterCharacters(searchTerm) {
    // Converter para minúsculas para busca case-insensitive
    const term = searchTerm.toLowerCase();

    // Filtrar array original
    filteredCharacters = allCharacters.filter(character =>
        character.name.toLowerCase().includes(term)
    );

    // Renderizar personagens filtrados
    renderCharacters(filteredCharacters);

    // Esconder paginação se houver busca
    if (searchTerm.trim() !== '') {
        pagination.style.display = 'none';
    } else {
        pagination.style.display = 'flex';
    }
}

// ===================================
// FUNÇÕES - MOSTRAR/ESCONDER ELEMENTOS
// ===================================

function showLoading() {
    loadingElement.style.display = 'flex';
    charactersContainer.style.display = 'none';
    pagination.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
    charactersContainer.style.display = 'grid';
}

function showError(message) {
    errorMessage.textContent = message;
    errorElement.style.display = 'block';
}

function hideError() {
    errorElement.style.display = 'none';
}

function showPagination() {
    pagination.style.display = 'flex';
    pageInfo.textContent = `Página ${currentPage}`;
}

// ===================================
// EVENT LISTENERS
// ===================================

// Buscar quando a página carrega
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando aplicação...');
    fetchCharacters(1);
});

// Buscar quando digita na barra de busca
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    filterCharacters(searchTerm);
});

// Botão anterior
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchCharacters(currentPage - 1);
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Botão próximo
nextBtn.addEventListener('click', () => {
    fetchCharacters(currentPage + 1);
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================================
// LOGS DE DESENVOLVIMENTO
// ===================================

console.log('Script carregado com sucesso!');
console.log('API: https://rickandmortyapi.com/api/character');
console.log('Documentação: https://rickandmortyapi.com/documentation');
