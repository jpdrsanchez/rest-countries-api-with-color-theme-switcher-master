import dropdown from './modules/dropdown';
import initEvents from './modules/fetchCountries';
import Mode from './modules/mode';
import callDetails from './modules/detailsFetch';

const darkMode = new Mode(
  '[data-mode="swithcer"]',
  'dark-mode',
  '[data-mode="dark"]',
);

dropdown();
initEvents();
callDetails();
