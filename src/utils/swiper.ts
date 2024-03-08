import 'swiper/css/bundle';

// @ts-expect-error : swiper bundle root
import Swiper from 'swiper/bundle';

export function swiperMember() {
  new Swiper('.swiper.is-midpage', {
    direction: 'horizontal',
    grabCursor: false,
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 64,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
      reverseDirection: false,
    },
    slideActiveClass: 'is-active',
    speed: 1500,
    pagination: {
      el: '.swiper-pagination.is-midpage',
      clickable: true,
      dynamicBullets: false,
    },
  });
}

// V1 - Number
/* export function swiperHome() {
  const swiper = new Swiper('.swiper.is-home', {
    direction: 'horizontal',
    grabCursor: false,
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 64,
    centeredSlides: true,
    autoplay: {
      delay: 10000,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
      reverseDirection: false,
    },
    navigation: {
      prevEl: '.swiper-slide-left',
      nextEl: '.swiper-slide-right',
    },
    slideActiveClass: 'is-active',
    speed: 1500,
    on: {
      realIndexChange: function () {
        updateSlideNumber((this as Swiper).realIndex + 1);
      },
    },
  });

  function updateSlideNumber(number: number) {
    const slideNumberElement = document.getElementById('slide-number');
    if (slideNumberElement) {
      slideNumberElement.textContent = `${number}`;
    }
  }

  updateSlideNumber(swiper.realIndex + 1);
} */

export function swiperHome(): void {
  const swiper = new Swiper('.swiper.is-home', {
    direction: 'horizontal',
    grabCursor: false,
    loop: false,
    slidesPerView: 'auto',
    spaceBetween: 64,
    centeredSlides: true,
    autoplay: {
      delay: 10000,
      pauseOnMouseEnter: false,
      disableOnInteraction: false,
      reverseDirection: false,
    },
    navigation: {
      prevEl: '.swiper-slide-left',
      nextEl: '.swiper-slide-right',
    },
    slideActiveClass: 'is-active',
    speed: 1500,
    on: {
      init: function (this: Swiper) {
        checkNavigationVisibility(this);
      },
      slideChange: function (this: Swiper) {
        checkNavigationVisibility(this);
      },
    },
  });

  function checkNavigationVisibility(swiper: Swiper): void {
    const prevButton = document.querySelector<HTMLElement>('.swiper-slide-left');
    const nextButton = document.querySelector<HTMLElement>('.swiper-slide-right');

    if (!prevButton || !nextButton) return;

    prevButton.style.display = swiper.isBeginning ? 'none' : 'flex';
    nextButton.style.display = swiper.isEnd ? 'none' : 'flex';
  }

  checkNavigationVisibility(swiper);
}
