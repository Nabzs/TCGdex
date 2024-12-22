const searchPokemon1 = document.getElementById('searchPokemon1');
const searchPokemon2 = document.getElementById('searchPokemon2');
const compareButton = document.getElementById('comparePokemon');
const comparisonResultsDiv = document.getElementById('comparisonResults');

compareButton.addEventListener('click', async () => {
    const name1 = searchPokemon1.value.toLowerCase();
    const name2 = searchPokemon2.value.toLowerCase();

    const [response1, response2] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${name1}`).then(res => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon/${name2}`).then(res => res.json())
    ]);

    if (response1 && response2) {
        comparisonResultsDiv.innerHTML = `
            <table>
                <tr>
                    <th>Statistique</th>
                    <th>${response1.name}</th>
                    <th>${response2.name}</th>
                </tr>
                <tr>
                    <td>Attaque</td>
                    <td>${response1.stats.find(stat => stat.stat.name === 'attack').base_stat}</td>
                    <td>${response2.stats.find(stat => stat.stat.name === 'attack').base_stat}</td>
                </tr>
                <tr>
                    <td>Défense</td>
                    <td>${response1.stats.find(stat => stat.stat.name === 'defense').base_stat}</td>
                    <td>${response2.stats.find(stat => stat.stat.name === 'defense').base_stat}</td>
                </tr>
                <tr>
                    <td>Vitesse</td>
                    <td>${response1.stats.find(stat => stat.stat.name === 'speed').base_stat}</td>
                    <td>${response2.stats.find(stat => stat.stat.name === 'speed').base_stat}</td>
                </tr>
            </table>
        `;
    } else {
        comparisonResultsDiv.innerHTML = `<p>Les Pokémon n'ont pas été trouvés. Veuillez réessayer.</p>`;
    }
});
