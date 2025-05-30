const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
const info = document.getElementById('pokemon-info');
const message = document.getElementById('message');
const favoritesDiv = document.getElementById('favorites');

function searchPokemon() {
  const name = document.getElementById('search').value.toLowerCase().trim();
  if (!name) return;

  fetch(apiUrl + name)
    .then(response => {
      if (!response.ok) throw new Error('Покемона не знайдено');
      return response.json();
    })
    .then(data => showPokemon(data))
    .catch(err => showMessage(err.message));
}

function showPokemon(pokemon) {
  message.textContent = '';
  info.innerHTML = `
    <div class=\"pokemon-card\">
      <img src=\"${pokemon.sprites.front_default}\" alt=\"${pokemon.name}\" />
      <h3>${pokemon.name}</h3>
      <p>Тип: ${pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p>Вага: ${pokemon.weight}</p>
      <p>Здібності: ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
      <button onclick=\"addToFavorites('${pokemon.name}')\">Додати до улюблених</button>
    </div>
  `;
}

function showMessage(msg) {
  info.innerHTML = '';
  message.textContent = msg;
}

function addToFavorites(name) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(name)) {
    favorites.push(name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
  }
}

function removeFromFavorites(name) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(n => n !== name);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadFavorites();
}

function loadFavorites() {
  favoritesDiv.innerHTML = '';
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.forEach(name => {
    fetch(apiUrl + name)
      .then(res => res.json())
      .then(pokemon => {
        favoritesDiv.innerHTML += `
          <div class=\"pokemon-card\">
            <img src=\"${pokemon.sprites.front_default}\" />
            <h4>${pokemon.name}</h4>
            <button onclick=\"removeFromFavorites('${pokemon.name}')\">Видалити</button>
          </div>
        `;
      });
  });
}

loadFavorites();
