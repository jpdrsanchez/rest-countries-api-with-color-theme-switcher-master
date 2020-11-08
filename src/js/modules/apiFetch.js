import ScrollAnimation from './scroll';

export default class ApiFetch {
  constructor(url, fields, separator) {
    this.url = url;
    this.fields = fields.join(separator);
    this.countrieWrapper = document.querySelector('[data-fetch="container"]');
    this.insertCountriesInHome = this.insertCountriesInHome.bind(this);
  }

  async fetchCountries() {
    this.getCountries = await fetch(`${this.url}?fields=${this.fields}`);
    return this.getCountries.json();
  }

  async setSessionStorage() {
    if (!sessionStorage.countriesJson) {
      const countries = await this.fetchCountries();
      sessionStorage.countriesJson = JSON.stringify(countries);
    }
    return this;
  }

  showResponseAsJson() {
    this.json = JSON.parse(sessionStorage.countriesJson);
    return this.json;
  }

  createHomeTemplate({ code, image, name, population, region, capital }) {
    const countrieItem = document.createElement('li');
    countrieItem.setAttribute('data-scroll', '');
    countrieItem.classList.add('countries-item');
    countrieItem.innerHTML = `
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
      </a>`;
    return countrieItem;
  }

  createNoTermsTemplate() {
    const errorElement = document.createElement('p');
    errorElement.classList.add('countries-error');
    errorElement.innerText = 'Sorry, no results match your search criteria =(';
    return errorElement;
  }

  createArrayCountriesHome(countries) {
    this.homeArray = countries.map((countrie) => ({
      code: countrie.alpha3Code,
      image: countrie.flag,
      name: countrie.name,
      population: countrie.population.toLocaleString('en-US'),
      region: countrie.region,
      capital: countrie.capital,
    }));
    this.homeTemplate = this.putHomeTemplateInCountries(this.homeArray);
    return this.homeTemplate;
  }

  putHomeTemplateInCountries(countries) {
    this.template = countries.map(this.createHomeTemplate);
    return this.template;
  }

  fillDetailsPage([countrie]) {
    const {
      image,
      name,
      nativeName,
      population,
      region,
      subregion,
      capital,
      topLevel,
      currencies,
      languages,
      borders,
    } = {
      image: document.querySelector('[data-details="image"]'),
      name: document.querySelector('[data-details="title"]'),
      nativeName: document.querySelector('[data-details="nativeName"]'),
      population: document.querySelector('[data-details="population"]'),
      region: document.querySelector('[data-details="region"]'),
      subregion: document.querySelector('[data-details="subregion"]'),
      capital: document.querySelector('[data-details="capital"]'),
      topLevel: document.querySelector('[data-details="topLevelDomain"]'),
      currencies: document.querySelector('[data-details="currencies"]'),
      languages: document.querySelector('[data-details="languages"]'),
      borders: document.querySelector('[data-details="borders"]'),
    };
    image.setAttribute('src', countrie.flag);
    image.setAttribute('alt', countrie.name);
    name.innerText = countrie.name;
    nativeName.innerText = countrie.nativeName;
    population.innerText = countrie.population.toLocaleString('en-US');
    region.innerText = countrie.region;
    subregion.innerText = countrie.subregion;
    capital.innerText = countrie.capital;
    topLevel.innerText = countrie.topLevelDomain.join(', ');
    currencies.innerText = countrie.currencies
      .map((currencie) => currencie.name)
      .join(', ');
    languages.innerText = countrie.languages
      .map((language) => language.name)
      .join(', ');
    borders.innerHTML = countrie.borders
      .map((border) => {
        const [borderCountrie] = this.countries.filter(
          (name) => name.alpha3Code === border,
        );
        return `<li class="details-borders-item"><a href="#" data-border=${borderCountrie.alpha3Code}>${borderCountrie.name}</a></li>`;
      })
      .join('');
  }

  callDetaisPage(countrie) {
    const homePageItems = document.querySelectorAll('[data-page="home"]');
    const detailsPage = document.querySelector('[data-page="details"]');
    homePageItems.forEach((item) => {
      if (!item.classList.contains('hide')) item.classList.add('hide');
    });
    if (detailsPage.classList.contains('active'))
      detailsPage.classList.remove('active');
    setTimeout(() => detailsPage.classList.add('active'));
    this.fillDetailsPage(countrie);
    const internalLinks = document.querySelectorAll('[data-border]');
    this.interanlDetailsLinkCLick(internalLinks);
    return this;
  }

  interanlDetailsLinkCLick(elements) {
    elements.forEach((element) =>
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const countrieCode = event.target.dataset.border;
        this.callDetaisCountrie(countrieCode);
      }),
    );
  }

  callDetaisCountrie(code) {
    const getCountrie = this.countries.filter(
      (countrie) => countrie.alpha3Code === code,
    );
    this.callDetaisPage(getCountrie);
    return this;
  }

  async insertCountriesInHome(countrie) {
    if (this.countrieWrapper.children.length) {
      [...this.countrieWrapper.children].forEach((item) =>
        this.countrieWrapper.removeChild(item),
      );
    }

    const loading = document.querySelector('[data-loading]');
    const countries = this.createArrayCountriesHome(countrie);
    const error = this.createNoTermsTemplate();

    if (loading.classList.contains('hide')) loading.classList.remove('hide');
    await new Promise((resolve) => {
      setTimeout(() => {
        if (countries.length)
          countries.forEach((item) => {
            this.countrieWrapper.appendChild(item);
          });
        else this.countrieWrapper.appendChild(error);
        loading.classList.add('hide');
        resolve();
      }, 1000);
    });

    new ScrollAnimation('[data-scroll]', '[data-fetch="container"]');

    [...this.countrieWrapper.children].forEach((item) => {
      const [child] = item.children;
      child.addEventListener('click', (event) => {
        event.preventDefault();
        this.callDetaisCountrie(child.dataset.countrie);
      });
    });

    return this;
  }

  addApiEvents(countrie) {
    window.addEventListener('load', () => this.insertCountriesInHome(countrie));
    return this;
  }

  searchByRegion(region) {
    const countries = this.countries.filter(
      (countrie) => countrie.region === region,
    );
    this.insertCountriesInHome(countries);
    return this.countries;
  }

  searchByText(text) {
    const term = text.toLowerCase().trim();
    const countries = this.countries.filter((countrie) =>
      countrie.name.toLowerCase().includes(term),
    );

    this.insertCountriesInHome(countries);
  }

  callDetailsPage() {}

  async init() {
    await this.setSessionStorage();
    this.countries = this.showResponseAsJson();
    this.addApiEvents(this.countries);
    return this;
  }
}
