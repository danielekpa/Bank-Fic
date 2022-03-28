'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navLinks = document.querySelectorAll('.nav__link');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const navBar = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');


/* document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.section').forEach(section => {
    
  });
}); */

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  e.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

console.log(btnsOpenModal);
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//////////////////////
/// Button scrolling
learnMoreBtn.addEventListener('click', (e) => {
  const s1position = section1.getBoundingClientRect();
  console.log(s1position);
  console.log('Current scroll X/Y', window.scrollX, window.scrollY);
  // window.scrollTo({ left: s1position.left + window.scrollX, top: s1position.top + window.scrollY, behavior: 'smooth' });
  window.scrollBy({ left: s1position.left, top: s1position.top, behavior: 'smooth' });
  // window.scrollTo({ left: s1Pos.left, top: s1Pos.top, behavior: 'smooth' });
  // section1.scrollIntoView({ behavior: 'smooth' })
  /* console.log('H/W of ViewPort', document.documentElement.clientHeight, document.body.clientWidth);
  console.log(e.target.getBoundingClientRect());
  */
})


//// Page NAVIGATION
/* navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    link.style.backgroundColor = randomColor()
    // console.log('Link -', e.target, e.currentTarget);
  });
}); */


/////// EVENT DELEGATION for Page NAVIGATION
// 1. Add event listener to commont parent element
// 2. Determine what child element originated the event. 

document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target?.classList.contains('nav__link')) {
    const sectionID = e.target.getAttribute('href');
    // console.log(document.querySelector(sectionID));
    document.querySelector(sectionID).scrollIntoView({ behavior: 'smooth' });
  }
});

/////// Tabbed Components
tabsContainer.addEventListener('click', e => {
  // console.log(e.target.closest('.operations__tab'));

  const activeBtn = 'operations__tab--active';
  const activeTabCtnt = 'operations__content--active';
  const btn = e.target.closest('.operations__tab');
  // Guard clause
  if (!btn) return;

  // Remove Active classes from Tab and Content
  tabs.forEach((tab) => tab.classList.remove(activeBtn));
  tabsContent.forEach(tabCtnt => tabCtnt.classList.remove(activeTabCtnt));

  // Active tab and Active content area
  btn.classList.add(activeBtn);
  const tabContentNum = btn.dataset.tab;
  document.querySelector(`.operations__content--${tabContentNum}`).classList.add(activeTabCtnt);
});

// Menu fade animation 
const navLinkAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const curNavLink = e.target;
    const siblingLinks = curNavLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = curNavLink.closest('.nav').querySelector('.nav__logo');

    logo.style.opacity = this;
    siblingLinks.forEach((link) => {
      if (link !== curNavLink) link.style.opacity = this;
    });
  }
}

// Passing "argument" into handler 
// Bind method returns a new function with its 'this' keyword set to the value in the bind method
navBar.addEventListener('mouseover', navLinkAnimation.bind(0.5));
navBar.addEventListener('mouseout', navLinkAnimation.bind(1));
// navBar.addEventListener('mouseover', (e) => navLinkAnimation(e, 0.5));
// navBar.addEventListener('mouseout', (e) => navLinkAnimation(e, 1));
// Addevent callback calling another callbackwith multiple "arguments"


/////// Sticky navigation
/* window.addEventListener('scroll', (e) => {
  // console.log(window.scrollY);
}) */
const navHeight = navBar.getBoundingClientRect().height;
console.log(navHeight);
const stickyNav = (entries) => {
  const [entry] = entries;
  !entry.isIntersecting ? navBar.classList.add('sticky') : navBar.classList.remove('sticky');
}
const observerOptions = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
}
const headerObserver = new IntersectionObserver(stickyNav, observerOptions);
headerObserver.observe(header);

////  Reveal sections on scroll
const revealSection = function (entries, observer) {

  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  // rootMargin: '80px',
});
allSections.forEach((section) => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
})

//// Lazy loading images 
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImage = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  // Replace src att with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img')); // Remove filter once image loaded
  observer.unobserve(entry.target); //Stop observing the image
}

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '-200px'
})
imgTargets.forEach(img => imgObserver.observe(img));


///// Slider components
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  let curDot = 0;
  const maxSlide = slides.length;


  /// Functions
  const createDots = function () {
    slides.forEach((_, index) =>
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`)
    );
  }
  const goToSlide = function (targetSlide) {
    slides.forEach((slide, index) =>
      slide.style.transform = `translateX(${100 * (index - targetSlide)}%)`
    );
  }
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach((dot) => {
      dot.classList.remove("dots__dot--active");
      if (dot.dataset.slide == slide) {
        dot.classList.add('dots__dot--active');
      }
    });
  }

  // Next slide 
  const nextSlide = function () {
    if (curSlide === (maxSlide - 1)) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // Previous slide 
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  /// Initialize function
  const init = () => {
    createDots();
    goToSlide(0);
    activateDot(0);
  }
  init();

  // Event Handlers
  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);
  document.body.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    const { classList: dotClasslist } = e.target;
    const { target: dot } = e;
    const { slide } = dot.dataset;

    if (dotClasslist.contains('dots__dot')) {
      goToSlide(slide);
      activateDot(slide);
    }
  })
};
slider();

/* Tutorial */
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///////////////////////////////////////
// Selecting, Creating, and Deleting Elements
// Selecting elements

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);
console.log(document.main);


const sections = document.querySelectorAll('.section');
console.log(sections); //Node list

document.getElementById('section--1');

const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // HTML Collection

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);
// Delete elements
/* document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  // message.remove();
  message.parentElement.removeChild(message);
}); */


///////////////////////////////////////
// Styles, Attributes and Classes

//// Styles
// document.querySelector('.cookie-message').style.padding = '1rem';
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';
console.log(message.style.height);

/// Changing the value of a CSS Custom Property
// document.documentElement.style.setProperty('--color-primary', 'blue');
message.style.setProperty('color', 'white');
console.log(message.style.getPropertyValue('color'));

//// Attributes 
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Standard attributes
console.log(logo.src)


// None standard Attributes
console.log(logo.designer)
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes 
logo.classList.add('c')
logo.classList.remove('c')
logo.classList.toggle('c')
logo.classList.contains('c'); //not includes

// Don't use
// logo.className = 'jonas';

///// Events 
/* const alertH1 = function (e) {
  alert('addEventListener: H1 here');
};

const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', alertH1); */
// h1.onmouseenter = alertH1;

/* setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 1000); */

///// Event Propagation 
// rgb(255, 255, 255)
/* const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor()); */
document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  // this.style.backgroundColor = randomColor();
  console.log('Link -', e.target, e.currentTarget);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // this.style.backgroundColor = randomColor();
  console.log('Container -', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  // this.style.backgroundColor = randomColor();
  console.log('Nav -', e.target, e.currentTarget);
});

//////// Dom Traversing 
//// Going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = randomColor();
// h1.lastElementChild.style.color = randomColor();

//// Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

//// Going sideways: siblings
// console.log(h1.previousSibling); // For nodes
// console.log(h1.previousElementSibling);
// console.log(h1.nextSibling); // For nodes
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children);
// console.log([...h1.parentElement.children]);


////// Lifecycle DOM Events

/* window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
}) */
