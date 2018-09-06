const clippingsList = document.getElementById('clippings-list');
const clippingList = docuemnt
const copyFromClipboardButton = document.getElementById('copy-from-clipboard');

const createClippingElement = (clippingText) => {
	const clippingElement = document.createElement('article'); // A

	clippingElement.classList.add('clippings-list-item');

	clippingElement.innerHTML = ` // B
	<div class="clipping-text" disabled="true"></div>
	<div class="clipping-controls">
	  <button class="copy-clipping">&rarr; Clipboard</button>
	  <button class="publish-clipping">Publish</button>
	  <button class="remove-clipping">Remove</button>
	</div>
  `;

	clippingElement.querySelector('.clipping-text').innerText = clippingText; //C

	return clippingElement; // D
};

const { clipboard } = require('electron'); // A

const addClippingToList = () => {
	const clippingText = clipboard.readText(); // B
	const clippingElement = createClippingElement(clippingText); // C
	clippingsList.prepend(clippingElement); // D
};

copyFromClipboardButton.addEventListener('click', addClippingToList); // E

clippingsList.addEventListener('click', (event) => { // A
	const hasClass = className => event.target.classList.contains(className); // B

	if (hasClass('remove-clipping')) console.log('Remove clipping'); // C
	if (hasClass('copy-clipping')) console.log('Copy clipping');
	if (hasClass('publish-clipping')) console.log('Publish clipping');
});

