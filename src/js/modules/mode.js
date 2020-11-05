export default class DarkMode {
  constructor(switcher, darkModeClass, elements) {
    // Element that will switch between darkmode and lightmode
    this.switch = document.querySelector(switcher);
    // Elements affected when we change the switch
    this.elements = document.querySelectorAll(elements);
    // Class that will be added in the elements affected by the darkmode or lightmode
    this.darkModeClass =
      darkModeClass === undefined ? 'dark-mode' : darkModeClass;

    this.switchTheme = this.switchTheme.bind(this);
    this.init();
  }

  setLocalStorage() {
    const isDarkModeDefault = window.matchMedia('(prefers-color-scheme: dark)')
      .matches;
    if (!localStorage.theme) {
      localStorage.theme = isDarkModeDefault ? 'dark' : 'light';
    }
    return this;
  }

  setDefaultTheme() {
    if (localStorage.theme === 'dark') {
      this.elements.forEach((element) =>
        element.classList.add(this.darkModeClass),
      );
      this.switch.firstElementChild.className = 'fas fa-moon';
    }
    return this;
  }

  switchTheme(e) {
    e.preventDefault();
    this.elements.forEach((element) =>
      element.classList.toggle(this.darkModeClass),
    );
    localStorage.theme = localStorage.theme === 'dark' ? 'light' : 'dark';
    this.switch.firstElementChild.className =
      localStorage.theme === 'dark' ? 'fas fa-moon' : 'far fa-moon';
    return this;
  }

  addEvents() {
    this.switch.addEventListener('click', this.switchTheme);
    return this;
  }

  init() {
    if (this.switch && this.elements.length) {
      this.setLocalStorage();
      this.setDefaultTheme();
      this.addEvents();
    }
    return this;
  }
}
