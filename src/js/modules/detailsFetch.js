const callDetails = async () => {
  const pageDetails = document.querySelector('[data-page="details"]');
  const pageHome = document.querySelectorAll('[data-page="home"]');
  const pageDetailsItems = document.querySelectorAll('[data-details]');
  const pageDetailsButton = document.querySelector('[data-details="back"]');
  const detailLoading = document.querySelector('[data-load-detail]');
  let pageClick;
  let timer;

  timer = await new Promise((resolve) => {
    setInterval(() => {
      pageClick = document.querySelectorAll('[data-page="click"]');
      if (pageClick.length) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });

  const fetchAllItems = async () => {
    const allCountries = await fetch(
      'https://restcountries.eu/rest/v2/all?fields=name;alpha3Code',
    );
    const toJson = await allCountries.json();
    return toJson;
  };

  const fetchPageDetails = async (code) => {
    const fetchCode = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${code}?fields=name;nativeName;population;region;subregion;capital;topLevelDomain;currencies;languages;borders;flag`,
    );
    return fetchCode.json();
  };

  const putDetailsIntoDom = async (code) => {
    const getAllCountries = await fetchAllItems();
    const getPage = await fetchPageDetails(code);
    pageDetailsItems.forEach((item, index) => {
      switch (item.dataset.details) {
        case 'image':
          item.setAttribute('src', getPage.flag);
          item.setAttribute('alt', getPage.name);
          break;

        case 'title':
          item.innerText = getPage.name;
          break;

        case 'nativeName':
          item.innerText = getPage.nativeName;
          break;

        case 'population':
          item.innerText = getPage.population.toLocaleString('en-US');
          break;

        case 'region':
          item.innerText = getPage.region;
          break;

        case 'subregion':
          item.innerText = getPage.subregion;
          break;

        case 'capital':
          item.innerText = getPage.capital;
          break;

        case 'topLevelDomain':
          item.innerText = getPage.topLevelDomain.join(', ');
          break;

        case 'currencies':
          item.innerText = getPage.currencies
            .map((currencie) => currencie.name)
            .join(', ');
          break;

        case 'languages':
          item.innerText = getPage.languages
            .map((language) => language.name)
            .join(', ');
          break;

        case 'borders':
          item.innerHTML = getPage.borders
            .map((border) => {
              const [countrieName] = getAllCountries.filter(
                (name) => name.alpha3Code === border,
              );
              return `<li class="details-borders-item"><a href="#" data-border=${countrieName.alpha3Code}>${countrieName.name}</a></li>`;
            })
            .join('');
          break;

        default:
          break;
      }
    });
  };

  const handleDetailInternClick = async (event) => {
    event.preventDefault();
    const borderCode = event.currentTarget.dataset.border;
    pageDetails.classList.remove('active');
    await putDetailsIntoDom(borderCode);
    pageDetails.classList.add('active');
    const detailsLinks = document.querySelectorAll('[data-border]');
    detailsLinks.forEach((link) =>
      link.addEventListener('click', handleDetailInternClick),
    );
  };

  const handleCountrieClick = async (event) => {
    event.preventDefault();
    pageDetails.classList.add('active');
    pageHome.forEach((page) => page.classList.add('hide'));
    const elementCode = event.currentTarget.dataset.countrie;
    await putDetailsIntoDom(elementCode);
    const detailsLinks = document.querySelectorAll('[data-border]');
    detailsLinks.forEach((link) =>
      link.addEventListener('click', handleDetailInternClick),
    );
  };

  pageClick.forEach((link) => {
    link.addEventListener('click', handleCountrieClick);
  });

  const handleBackClick = (event) => {
    event.preventDefault();
    pageDetails.classList.remove('active');
    pageHome.forEach((page) => page.classList.remove('hide'));
  };

  pageDetailsButton.addEventListener('click', handleBackClick);
};

export default callDetails;
