import './style.css';

interface ModalProps {
  title?: string;
  body?: string;
  buttonText?: string;
  modalBtnCB?: () => void;
}

// Legger inn noen defaultverdier, bare i tilfelle
export default function modal({
  title = 'Ingen tittel',
  body = '',
  buttonText = 'Lukk',
  modalBtnCB = () => {},
}: ModalProps) {
  const modal = <HTMLDivElement>document.querySelector('#modal');

  modal.innerHTML = `
  <div class="modal-wrapper">
    <div class="modal-content" aria-labelledby="modal-title" aria-modal="true" role="dialog">
      <div class="modal-header">
        <div class="modal-logo"><span aria-hidden="true">🤯</span></div> 
        <h1 class="modal-title">${title}</h2>
      </div>
      <div class="modal-body">
        <p>${body}</p>
      </div>
      <div class="modal-footer">
        <button class="btn-standard modal-close">Prøv igjen</button>
      </div>
    </div>
  </div>
  `;

  const closeButton = <HTMLButtonElement>document.querySelector('.modal-close');
  closeButton.addEventListener('click', () => {
    modalBtnCB(); // Runs the optional callback function from props
    modal.innerHTML = '';
  });
}
