$ = jQuery = require('jquery');

function addElement (etype, eclass, eparent) {
	let newElem = document.createElement(etype);
	newElem.setAttribute('class', eclass);
	eparent.appendChild(newElem);
	return newElem;
}

function addElementTxt (etype, eclass, eparent, htmlText) {
	let newElem = document.createElement(etype);
	newElem.setAttribute('class', eclass);
	eparent.appendChild(newElem);
	newElem.innerHTML = htmlText;
	return newElem;
}

const site = document.querySelector('#site');


class ManagerCharacter {
	constructor(manager, character) {
		this.manager = manager;
		this.character = character;

		this.div = addElement('div', 'character', this.manager.charList);
		this.nameDiv = addElementTxt('div', 'name mbot20', this.div, `<h3>${this.character.name}</h3>`);
		this.info = addElementTxt('div', 'info', this.div,
			`<p>Profession: ${this.character.profession}</p><p>Level: ${this.character.level}</p><p>Server: ${this.character.server}</p>`);
		this.deleteButton = addElementTxt('button', 'delete mtop20', this.div, 'Remove');
		this.deleteButton.addEventListener('click', () => {
			this.deletePrompt();
		})

	}

	deletePrompt() {
		let promptCover = addElement('div', 'window-cover', site);
		let promptDiv = addElementTxt('div', 'prompt', site, "<h3>Do you want to DELETE "+ this.character.name +" from your list?</h3>");
		let deleteNoButton = addElementTxt('button', '', promptDiv, " Cancel");
		let deleteYesButton = addElementTxt('button', '', promptDiv, "DELETE");

		promptCover.addEventListener('click', () => {
			promptDiv.parentNode.removeChild(promptDiv);
			promptCover.parentNode.removeChild(promptCover);
		})

		deleteNoButton.addEventListener('click', () => {
			promptDiv.parentNode.removeChild(promptDiv);
			promptCover.parentNode.removeChild(promptCover);
		})

		deleteYesButton.addEventListener('click', () => {
            promptDiv.parentNode.removeChild(promptDiv);
			promptCover.parentNode.removeChild(promptCover);
            this.delete()
        })
	}

	delete () {
		// delete from database, delete this object and remove character from controller
		let char_to_remove = this;
		$.ajax({
			type: "POST",
			dataType: "JSON",
			data: {id: char_to_remove.character.id},
			url: "./php/characters/deleteCharacter.php",
			success: (ret) => {
				if (ret.fb == 'success') {
					char_to_remove.manager.controller.removeCharacter(char_to_remove.character);
					char_to_remove.div.parentNode.removeChild(this.div);
				} else { alert(ret.fb); }
			}
		})
	}
}

class CharacterManager {
	constructor(controller) {
		controller.setOpenedWindow(this);
		this.controller = controller;
		this.div = addElement('div', 'manager-window', site);
		this.title = addElementTxt('h3', 'page-title', this.div, "My Characters");
		this.charList = addElement('div', 'wrap-list', this.div);

		this.addCharacterWrapper = addElement('div', 'input-box shadow-box', this.div);
		this.addCharacterDiv = addElementTxt('div', 'flex-div center', this.addCharacterWrapper, "<p class='input-label'>Add Character:</p>");
		this.addNameInput = addElement('input', 'mside10 medium-input', this.addCharacterDiv);
		this.feedbackDiv = addElement('div', 'wrap-list', this.addCharacterDiv);
		this.addButton = addElementTxt('button', '', this.addCharacterDiv, "Add");

		this.addButton.addEventListener('click', () => { this.addNewCharacter(); })
		this.addButton.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) { this.addNewCharacter(); }
		});
		this.addNameInput.focus();
		
		controller.characters.forEach((character) => { new ManagerCharacter(this, character); });

	}

	addNewCharacter() {
		let char_name = this.addNameInput.value;
		if (char_name.length < 1) {
			this.feedbackDiv.innerHTML = "Fill character name";
		} else {
			let cm = this;
			$.ajax({
				type: "POST",
				dataType: "JSON",
				url: "./php/characters/addCharacter.php",
				data: {name: char_name},
				success: (ret) => {
					console.log(ret);
					if (ret.fb == 'success') {
						cm.controller.addCharacter(ret.character);
						new ManagerCharacter(cm, ret.character);

						//character is added, now try adding prices for his server
						cm.controller.addNewImbuPrices(ret.character.server);
					} else {
						alert(ret.fb);
					}
				}
			})
		}
	}

	close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openCharacterManager = (controller) => {
    return new CharacterManager(controller);
}

export { openCharacterManager };