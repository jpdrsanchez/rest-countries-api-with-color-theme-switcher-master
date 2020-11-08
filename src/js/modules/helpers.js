export const debounce = (callback, delay) => {
  let timer;

  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, delay);
  };
};

// Function to handle the event bubble
export const outsideClick = (callback, ...elements) => {
  const html = document.documentElement;
  const [firstElement] = elements;
  const outsideAttr = 'data-outside';
  const handleOutsideClick = (event) => {
    const isNotCurrentElements = elements.every(
      (element) => !element.contains(event.target),
    );

    if (isNotCurrentElements) {
      html.removeEventListener('click', handleOutsideClick);
      firstElement.removeAttribute(outsideAttr);
      callback();
    }
  };
  if (!firstElement.hasAttribute(outsideAttr)) {
    setTimeout(() => html.addEventListener('click', handleOutsideClick));
  }
  firstElement.setAttribute(outsideAttr, '');
};
