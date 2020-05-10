

let numberOfModal = 0;
let backdrop;

const getScrollbarWidth = () => {
  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'modal-scrollbar-measure';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

const open = () => {
  // add
  const isBodyOverflowing = document.body.clientWidth < window.innerWidth;
  if (isBodyOverflowing) {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  // add class
  let bodyCls = document.body.className;
  bodyCls = bodyCls.replace(/(\s?modal-open|$)/ig, ' modal-open');
  document.body.className = bodyCls.trim();
};

const close = () => {
  document.body.className = document.body.className.replace(/\s?modal-open/ig, '');
  document.body.style.paddingRight = 0;
};

function addBackdrop() {
  numberOfModal += 1;

  if (!backdrop) {
    open();
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.zIndex = 10;
    document.body.appendChild(backdrop);
  }
}

function removeBackdrop() {
  if (numberOfModal > 0) {
    numberOfModal -= 1;

    if (backdrop && numberOfModal === 0) {
      backdrop.parentNode.removeChild(backdrop);
      backdrop = null;
      close();
    }
  }
}


export {
  addBackdrop,
  removeBackdrop,
};
