document.addEventListener("DOMContentLoaded", function () {
    // Affiche le loader
    setTimeout(function () {
        // Cacher le loader apres 9 sec
        document.getElementById('loader').style.display = 'none';
        const content = document.getElementById('content');
        content.style.display = 'block';
        content.classList.add('fade-in');
    }, 9000); // 9 secondes moyenne de chargement des cartes
});

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.pokemontcg.io/v2/cards';
    const cardList = document.getElementById('card-list');
    const typeFilter = document.getElementById('type-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    const setFilter = document.getElementById('set-filter');

    let allCards = [];

    // Fonction pour récupérer les cartes depuis l'API
    async function fetchCards() {
        try {
            const response = await fetch(`${apiUrl}?pageSize=512`);
            const data = await response.json();
            allCards = data.data;
            displayCards(allCards);
        } catch (error) {
            console.error('Erreur de récupération des cartes:', error);
        }
    }

    function displayCards(cards) {
        cardList.innerHTML = '';

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.tabIndex = 0; // Rendre la carte accessible au clavier
            cardElement.setAttribute('data-card-id', card.id);

            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
            `;

            // Ouvrir la pop-up en appuyant sur "Entrée" (accessibilitée)
            cardElement.addEventListener('click', () => openPopup(card.id));
            cardElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    openPopup(card.id);
                }
            });

            cardList.appendChild(cardElement);
        });
    }

    function openPopup(cardId) {
        const card = allCards.find(card => card.id === cardId);

        // Créer l'élément de la pop-up
        const popup = document.createElement('div');
        popup.tabIndex = 0; // Pop-up accessible au clavier
        popup.classList.add('popup');

        // Récupérer les cartes ayant le même nom
        const relatedCards = allCards.filter(c => c.name === card.name && c.id !== card.id);

        const typesImagesPopup = card.types ? card.types.map(type => {
            const typeImage = `../images/types/${type.toLowerCase()}.png`;
            return `<img src="${typeImage}" alt="${type}" class="popup-type-img">`;
        }).join('') : 'Aucun type';

        const energiesImagesPopup = card.energyType ? card.energyType.map(energy => {
            const energyImage = `../images/types/${energy.toLowerCase()}.png`;
            return `<img src="${energyImage}" alt="${energy}" class="popup-energy-img">`;
        }).join('') : 'Aucune énergie';

        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');

        popupContent.innerHTML = `
            <div class="popup-top">
                <div class="popup-image">
                    <img src="${card.images.large}" alt="${card.name}">
                </div>
                <div class="popup-details">
                    <h2>${card.name}</h2>
                    <div class="popup-types">${typesImagesPopup}</div>
                    <p><strong>Rareté:</strong> ${card.rarity || 'Inconnue'}</p>
                    <p><strong>Set:</strong> ${card.set.name}</p>
                    <p><strong>Évolution:</strong> ${card.evolvesFrom ? card.evolvesFrom : "Pas d'évolution"}</p>
                    <h3>Attaques</h3>
                    <div class="attack-list">
                        ${card.attacks.map(attack => `
                            <div class="attack-item" tabindex="0">
                                <p><strong>Attaque : ${attack.name}</strong>: ${attack.damage || 'Aucun'} dégâts</p>
                                <p><strong>Énergies nécessaires:</strong> ${attack.cost.map(cost => {
                                    const energyImage = `../images/types/${cost.toLowerCase()}.png`;
                                    return `<img src="${energyImage}" alt="${cost}" class="popup-energy-img">`;
                                }).join(' ')}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="related-cards-list">
                ${relatedCards.map(relatedCard => `
                    <img src="${relatedCard.images.small}" alt="${relatedCard.name}" class="related-card">
                `).join('')}
            </div>
            <button class="close-popup">X</button>
        `;

        const closePopupButton = popupContent.querySelector('.close-popup');
        closePopupButton.addEventListener('click', () => closePopup(popup));

        // Fermer la pop-up avec "Entrée" ou "Échap"
        popup.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                closePopup(popup);
            }
        });

        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        popup.style.display = 'flex';

        // Placer le focus sur la pop-up pour la navigation clavier
        popup.focus();
    }

    // Fermer la pop-up
    function closePopup(popup) {
        popup.remove();
    }

    // Fonction pour filtrer les cartes
    function filterCards() {
        const typeValue = typeFilter.value.toLowerCase();
        const rarityValue = rarityFilter.value.toLowerCase();
        const setValue = setFilter.value;

        const filteredCards = allCards.filter(card => {
            const matchesType = typeValue ? card.types?.some(type => type.toLowerCase() === typeValue) : true;
            const matchesRarity = rarityValue ? card.rarity?.toLowerCase() === rarityValue : true;
            const matchesSet = setValue ? card.set.id === setValue : true;
            return matchesType && matchesRarity && matchesSet;
        });

        displayCards(filteredCards);
    }

    typeFilter.addEventListener('change', filterCards);
    rarityFilter.addEventListener('change', filterCards);
    setFilter.addEventListener('change', filterCards);

    fetchCards();
});
