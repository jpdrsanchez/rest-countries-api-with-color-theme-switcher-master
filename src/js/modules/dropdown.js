import { outsideClick } from './helpers';

export default () => {
  const dropdownClick = document.querySelector('[data-dropdown="click"]');
  const dropdownList = document.querySelector('[data-dropdown="body"]');

  const openDropdownOptions = (event) => {
    event.preventDefault();
    dropdownList.classList.add('active');
    outsideClick(() => dropdownList.classList.remove('active'), dropdownList);
  };

  dropdownClick.addEventListener('click', openDropdownOptions);
};
