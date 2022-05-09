// DOM Objects
const mainScreen = document.querySelector('.main_screen');
const pokeName = document.querySelector('.pokemon_name');
const pokeId = document.querySelector('.pokemon_id');
const pokeFrontImage = document.querySelector('.pokemon_front_image');
const pokeTypeOne = document.querySelector('.pokemon_type_one');
const pokeTypeTwo = document.querySelector('.pokemon_type_two');
const pokeWeight = document.querySelector('.pokemon_weight');
const pokeHeight = document.querySelector('.pokemon_height');
const pokeListItems = document.querySelectorAll('.list_item');

// constants and variables
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];
let prevUrl = null;
let nextUrl = null;

// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
  mainScreen.classList.remove('hide');
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

const fetchPokeList = url => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const { results, previous, next } = data;
      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < pokeListItems.length ; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

      if (resultData) {
        const { name, url } = resultData;
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 2];
        pokeListItem.textContent = id + '. ' + capitalize(name);
      } else {
        pokeListItem.textContent = '';
      }
    }
  });
};

const fetchPokeData = id => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      resetScreen();

    const dataTypes = data['types'];
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];
    pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
    if (dataSecondType) {
      pokeTypeTwo.classList.remove('hide');
      pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
    } else {
      pokeTypeTwo.classList.add('hide');
      pokeTypeTwo.textContent = '';
    }
    mainScreen.classList.add(dataFirstType['type']['name']);

    pokeName.textContent = capitalize(data['name']);
    pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
    pokeWeight.textContent = data['weight'];
    pokeHeight.textContent = data['height'];
    pokeFrontImage.src = data['sprites']['front_default'] || '';
  });
};

const handleLeftButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
};

const handleRightButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
};

const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};

// adding event listeners
prevBtn.addEventListener('click', handleLeftButtonClick);
nextBtn.addEventListener('click', handleRightButtonClick);
for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}

// initialize pokeapi
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
// По нажатию на покемона, показать его картинку
// Добавить кнопки следующие и предыдущие
// по нажатию на которых выводятся следующие 20 покемонов
// или предыдущие