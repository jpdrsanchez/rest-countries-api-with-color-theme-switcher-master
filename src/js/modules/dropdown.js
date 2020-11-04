import initEvents from './fetchCountries';

export default function dropdown() {
  const clickDropdown = document.querySelector('[data-dropdown="click"]');
  const bodyDropdown = document.querySelector('[data-dropdown="body"]');

  function handleOutsideClick(event) {
    bodyDropdown.classList.remove('active');
    const regionName = event.target.innerText;
    if (!event.target.contains(bodyDropdown)) {
      clickDropdown.firstElementChild.innerText = regionName;
      initEvents(regionName);
    }
  }

  function handleClick(event) {
    event.preventDefault();
    bodyDropdown.classList.toggle('active');
  }

  clickDropdown.addEventListener('click', handleClick);
  bodyDropdown.addEventListener('click', handleOutsideClick);
}
