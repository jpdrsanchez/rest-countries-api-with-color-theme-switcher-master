import callDetails from './detailsFetch';

const countriesWrapper = document.querySelector('[data-fetch="container"]');
const form = document.querySelector('[data-fetch="form"]');
const searchText = document.querySelector('[data-fetch="search-text"]');
const loading = document.querySelector('[data-loading]');

const countrieTemplate = ({
  image,
  name,
  population,
  region,
  capital,
  code,
}) => `
  <li class="countries-item" data-scroll>
    <a href="#" data-page="click" data-countrie="${code}">
      <div class="countries-image">
        <img src="${image}" alt="${name}">
      </div>
      <div class="countries-information">
        <h2 class="countries-title">${name}</h2>
        <ul class="countries-information-list">
          <li class="countries-information-item"><span>Population: </span>${population}</li>
          <li class="countries-information-item"><span>Region: </span>${region}</li>
          <li class="countries-information-item"><span>Capital: </span>${capital}</li>
        </ul>
      </div>
    </a>
  </li>`;

const getCountries = async (name, option = 'none') => {
  let fetchCountries;
  if (option === 'none') {
    fetchCountries =
      name === undefined
        ? await fetch('https://restcountries.eu/rest/v2/all')
        : await fetch(`https://restcountries.eu/rest/v2/name/${name}`);
  } else {
    fetchCountries = await fetch(
      `https://restcountries.eu/rest/v2/region/${option}`,
    );
  }
  return fetchCountries.json();
};

const putTemplateIntoCountries = async (name, option = 'none') => {
  let countries;
  if (option === 'none') {
    countries =
      name === undefined ? await getCountries() : await getCountries(name);
  } else {
    countries = await getCountries(null, option);
  }

  const countriesArray =
    countries.status ||
    countries.map((countrie) => ({
      image: countrie.flag,
      name: countrie.name,
      population: countrie.population.toLocaleString('en-US'),
      region: countrie.region,
      capital: countrie.capital,
      code: countrie.alpha3Code,
    }));
  const countriesTemplate =
    countries.status || countriesArray.map(countrieTemplate);
  return countries.status === 404
    ? '<p class="countries-error">Sorry, no results match your search criteria =(</p>'
    : countriesTemplate.join('');
};

const putCountriesIntoDom = async (name, option = 'none') => {
  let countriesArray;
  if (option === 'none') {
    countriesArray =
      name === undefined
        ? await putTemplateIntoCountries()
        : await putTemplateIntoCountries(name);
  } else {
    countriesArray = await putTemplateIntoCountries(null, option);
  }
  const insert = await new Promise((resolve) => {
    setTimeout(() => {
      countriesWrapper.innerHTML = countriesArray;
      loading.classList.add('hide');
      resolve();
    }, 500);
  });
  callDetails();
};

let debounce = null;
const searchCountriesByName = async (event) => {
  countriesWrapper.innerHTML = '';
  if (loading.classList.contains('hide')) {
    loading.classList.remove('hide');
  }
  const input = event.currentTarget.value;
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (input.trim().length) {
      putCountriesIntoDom(input);
    } else {
      putCountriesIntoDom();
    }
  }, 800);
};

const initEvents = (region = 'none') => {
  if (region === 'none') {
    searchText.addEventListener('keyup', searchCountriesByName);
    form.addEventListener('submit', (e) => e.preventDefault());
    window.addEventListener('load', () => putCountriesIntoDom());
  } else {
    countriesWrapper.innerHTML = '';
    if (loading.classList.contains('hide')) {
      loading.classList.remove('hide');
    }
    putCountriesIntoDom(null, region);
  }
};

export default initEvents;
