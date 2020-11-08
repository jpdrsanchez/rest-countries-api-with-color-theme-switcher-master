import DarkMode from './modules/mode';
import ApiFetch from './modules/apiFetch';
import dropdown from './modules/dropdown';
import { debounce } from './modules/helpers';

new DarkMode('[data-mode="switch"]', 'dark-mode', '[data-mode="dark"]');

const countrieFecth = new ApiFetch(
  'https://restcountries.eu/rest/v2/all',
  [
    'alpha3Code',
    'borders',
    'capital',
    'flag',
    'languages',
    'name',
    'nativeName',
    'population',
    'region',
    'subregion',
    'topLevelDomain',
    'currencies',
  ],
  ';',
);

const setDefaultRegionText = () => {
  const textWrapper = document.querySelector('[data-dropdown="click"] span');
  const dropdownDefaultText = 'Filter by Region';

  textWrapper.innerText = dropdownDefaultText;
};

const resetFormFields = () => {
  const form = document.querySelector('[data-fetch="form"]');
  form.reset();
};

const callHomePage = () => {
  const homeButton = document.querySelectorAll('[data-home]');
  const homePageItems = document.querySelectorAll('[data-page="home"]');
  const detailsPage = document.querySelector('[data-page="details"]');

  const handleCallHome = (event) => {
    event.preventDefault();
    homePageItems.forEach((item) => {
      if (item.classList.contains('hide')) item.classList.remove('hide');
    });

    if (detailsPage.classList.contains('active'))
      detailsPage.classList.remove('active');
    const countrieJson = countrieFecth.showResponseAsJson();
    setDefaultRegionText();
    resetFormFields();
    countrieFecth.insertCountriesInHome(countrieJson);
  };

  homeButton.forEach((button) => {
    button.addEventListener('click', handleCallHome);
  });
};

const searchCountriesByText = () => {
  const searchInput = document.querySelector('[data-fetch="search-text"]');
  const countrieJson = countrieFecth.showResponseAsJson();

  const handleTextSearch = (input) => {
    const term = input.value;
    if (term.trim()) countrieFecth.searchByText(term);
    else {
      setDefaultRegionText();
      countrieFecth.insertCountriesInHome(countrieJson);
    }
  };

  const debounceKey = debounce(handleTextSearch, 600);
  searchInput.addEventListener('keyup', () => {
    debounceKey(searchInput);
  });
};

const searchCountriesByRegion = () => {
  const regionItems = document.querySelectorAll('[data-fetch="region"]');
  const textWrapper = document.querySelector('[data-dropdown="click"] span');

  const handleSearch = (event) => {
    event.preventDefault();
    resetFormFields();
    const thisElement = event.currentTarget;
    textWrapper.innerText = thisElement.innerText;
    countrieFecth.searchByRegion(thisElement.innerText);
  };

  regionItems.forEach((region) =>
    region.addEventListener('click', handleSearch),
  );
};

const initAllEvents = async () => {
  await countrieFecth.init();
  dropdown();
  searchCountriesByRegion();
  searchCountriesByText();
  callHomePage();
};

initAllEvents();
