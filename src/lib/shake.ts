// ******************************************************************
// Nice little shake effect for the clicked tile
// ******************************************************************

export function shake(clickedDOMElement: HTMLElement) {
  console.log('Shake!', clickedDOMElement);

  clickedDOMElement.classList.add('shake');
  setTimeout(() => {
    clickedDOMElement.classList.remove('shake');
  }, 500);
}
