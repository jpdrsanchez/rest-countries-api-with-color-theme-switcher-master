export default class Mode {
  constructor(switcher, darkModeClass, elements) {
    this.switcher = document.querySelector(switcher);
    this.elements = document.querySelectorAll(elements);
    this.darkModeClass = darkModeClass;
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
      this.switcher.firstElementChild.className = 'fas fa-moon';
    }
    return this;
  }

  switchTheme(e) {
    e.preventDefault();
    this.elements.forEach((element) =>
      element.classList.toggle(this.darkModeClass),
    );
    localStorage.theme = localStorage.theme === 'dark' ? 'light' : 'dark';
    this.switcher.firstElementChild.className =
      localStorage.theme === 'dark' ? 'fas fa-moon' : 'far fa-moon';
    return this;
  }

  addClickEvents() {
    this.switcher.addEventListener('click', this.switchTheme);
    return this;
  }

  init() {
    this.setLocalStorage();
    this.setDefaultTheme();
    this.addClickEvents();
    return this;
  }
}
