import { debounce } from './helpers';

export default class ScrollAnimation {
  constructor(elements, wrapper) {
    this.elements = document.querySelectorAll(elements);
    this.wrapper = document.querySelector(wrapper);
    this.halfWindow = window.innerHeight * 0.9;
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }
  handleScroll() {
    this.elements.forEach((element) => {
      const totalElementOffsetTop = this.wrapper.offsetTop + element.offsetTop;
      if (window.pageYOffset > totalElementOffsetTop - this.halfWindow) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }
  addEvents() {
    const debounceScroll = debounce(this.handleScroll, 150);
    window.addEventListener('scroll', debounceScroll);
  }

  init() {
    this.addEvents();
    this.handleScroll();
  }
}
