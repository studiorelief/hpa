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

export function swiperHome() {
  const swiper = new Swiper('.swiper.is-home', {
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
}
