import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function decorativeAnim() {
  // Utilisation d'une assertion de type pour convertir le résultat de toArray en 'gsap.DOMTarget[]'
  const images: gsap.DOMTarget[] = gsap.utils.toArray('.decorative-image') as gsap.DOMTarget[];

  images.forEach((image) => {
    gsap.to(image, {
      y: '7rem',
      ease: 'none',
      scrollTrigger: {
        markers: false,
        trigger: image,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}
