import { ModalProps } from '../types';
import { gameState } from './lib/gameState';
import './style.css';

// Legger inn noen defaultverdier, bare i tilfelle
export default function modal({
  title = 'Ingen tittel',
  body = '',
  buttonText = 'Lukk',
  modalBtnCB = () => {
    return;
  },
}: ModalProps) {
  const modal = document.querySelector('#modal');
  if (!modal) {
    throw new Error('Modal element missing from DOM');
  }

  gameState.modalIsOpen = true;

  if (modal instanceof HTMLElement) {
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
  }

  const closeButton = document.querySelector('.modal-close');

  if (closeButton instanceof HTMLElement) {
    closeButton.focus();
    closeButton.addEventListener('click', () => {
      modalBtnCB(); // Runs the optional callback function from props

      modal.innerHTML = '';
    });
  }
}
