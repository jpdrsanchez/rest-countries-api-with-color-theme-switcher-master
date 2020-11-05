import DarkMode from './modules/mode';
new DarkMode('[data-mode="switch"]', 'dark-mode', '[data-mode="dark"]');

import dropdown from './modules/dropdown';
import initEvents from './modules/fetchCountries';
import callDetails from './modules/detailsFetch';

dropdown();
initEvents();
callDetails();
