// *****************************************************************************
// Animate tiles using GSAP
// *****************************************************************************

import gsap from 'gsap';

export function animateTiles() {
  gsap.from('.even', {
    duration: 0.5,
    opacity: 0,
    x: -400,
    stagger: -0.05,
    rotate: '-90deg',
    ease: 'back',
  });
  gsap.from('.odd', {
    duration: 0.5,
    opacity: 0,
    x: 400,
    stagger: -0.05,
    rotate: '-90deg',
    ease: 'back',
  });
}
