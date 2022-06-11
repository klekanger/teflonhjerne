import { ModalProps } from '../types';
import { gameState } from './lib/gameState';
import './style.css';

// Legger inn noen defaultverdier, bare i tilfelle
export default function modal({
  title = 'Ingen tittel',
  body = '',
  buttonText = 'Lukk',
  modalBtnCB = () => {},
}: ModalProps) {
  const modal = <HTMLDivElement>document.querySelector('#modal');
  gameState.modalIsOpen = true;

  modal.innerHTML = `
  <div class="modal-wrapper">
    <div class="modal-content" aria-labelledby="modal-title" aria-modal="true" role="dialog">
      <div class="modal-header">
        <div class="modal-logo wiggle"><span aria-hidden="true">🤯</span></div> 
        <h1 class="modal-title">${title}</h2>
      </div>
      <div class="modal-body">
        <p>${body}</p>
      </div>
      <div class="modal-footer">
        <button class="btn-standard modal-close" tabindex="0"       >${buttonText}</button>
      </div>
    </div>
  </div>
  `;

  const closeButton = <HTMLButtonElement>document.querySelector('.modal-close');
  closeButton.focus();
  closeButton.addEventListener('click', () => {
    modalBtnCB(); // Runs the optional callback function from props
    modal.innerHTML = '';
  });
}
