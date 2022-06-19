// *****************************************************************************
// Animate tiles using GSAP
// *****************************************************************************

import gsap from 'gsap';

export function animateTiles() {
  gsap.from('.tile', {
    duration: 0.35,
    opacity: 0,
    y: -200,
    x: -400,
    stagger: -0.04,
    rotate: '-360deg',
    ease: 'back',
  });
}
