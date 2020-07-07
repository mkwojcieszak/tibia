$ = jQuery = require('jquery');
import { openCharacterManager } from './characterManager.js';
import { openActivityManager } from './activityManager.js';
import { openActivityFinder } from './activityFinder.js';
import { openImbuPricesManager } from './imbuPricesManager.js';
import { openSupportManager } from './supportManager.js';
import { openTicketManager } from './ticketManager.js';
import { openLootSplitter } from './lootSplitter.js';
import { openNewsDisplay } from './newsDisplay.js';

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
const sidepanel = document.querySelector('#side-panel');

// class CharacterSelector {
// 	constructor(userInterface) {
// 		this.userInterface = userInterface;

// 		this.cover = addElement('div', 'window-cover', site);
// 		this.cover.addEventListener('click', () => { this.close(); })
		
// 		this.div = addElement('ul', 'front-panel', site);

// 		userInterface.characters.forEach((character) => { this.addCharacter(character); });
// 	}

// 	addCharacter(character) {
// 		let charDiv = addElementTxt('li', '', this.div, character.name);
// 		charDiv.addEventListener('click', () => {
// 			this.userInterface.setActiveCharacter(character);
// 		});
// 	}

// 	close() {
//         this.cover.parentNode.removeChild(this.cover);
// 		this.div.parentNode.removeChild(this.div);
// 		delete this;
// 	}
// }

class ErrorDisplay {
	constructor(controller, message) {
		controller.setOpenedWindow(this);
		this.controller = controller;
		this.message = message;
		this.div = addElement('div', 'manager-error', site);
		this.txt = addElementTxt('h3', '', this.div, this.message);
		this.button = addElementTxt('button', 'main mtop20', this.div, "Manage Characters");
		this.button.addEventListener('click', () => { openCharacterManager(this.controller); });
	}

	close() {
        this.div.parentNode.removeChild(this.div);
        delete this;
    }
}

class UserInterface {
    constructor(controller) {
		this.controller = controller;
		this.controller.userInterface = this;
		this.div = document.querySelector('#interface');
		this.buttons = [];

		if (this.controller.power > 0) {
			this.ticketManagerButton = addElementTxt('button', 'primary-btn', this.div, "Tickets");
			this.ticketManagerButton.addEventListener('click', () => { openTicketManager(this.controller); });
			this.buttons.push(this.ticketManagerButton);

			openTicketManager(this.controller);
		}

		this.newsDisplayButton = addElementTxt('button', 'primary-btn', this.div, "News");
		this.newsDisplayButton.addEventListener('click', () => {
			if (this.controller.characters.length > 0) {
				openNewsDisplay(this.controller);
			} else {
				new ErrorDisplay(this.controller, "Add at least 1 character to follow activity on your servers.");
			}
		});
		this.buttons.push(this.newsDisplayButton);

		this.characterManagerButton = addElementTxt('button', 'primary-btn', this.div, "My Characters");
		this.characterManagerButton.addEventListener('click', () => { openCharacterManager(this.controller); });
		this.buttons.push(this.characterManagerButton);
		//this.activitiesButton = addElementTxt('button', 'primary-btn', this.div, "Activities");
		//this.activitiesList = addElement('div', 'list scroll', this.div);
		//this.activitiesButton.addEventListener('click', () => { this.activitiesList.classList.toggle('show'); });

		this.imbuPricesManagerButton = addElementTxt('button', 'primary-btn', this.div, "My Imbuing Prices");
		this.imbuPricesManagerButton.addEventListener('click', () => {
			if (this.controller.characters.length > 0) {
				openImbuPricesManager(this.controller);
			} else {
				new ErrorDisplay(this.controller, "Add at least 1 character to use this tool.");
			}
		});
		this.buttons.push(this.imbuPricesManagerButton);

		this.activityManagerButton = addElementTxt('button', 'primary-btn', this.div, "My Activities");
		this.activityManagerButton.addEventListener('click', () => {
			if (this.controller.characters.length > 0) {
				openActivityManager(this.controller);
			} else {
				new ErrorDisplay(this.controller, "Add at least 1 character to use this tool.");
			}
		});
		this.buttons.push(this.activityManagerButton);

		this.activityFinderButton = addElementTxt('button', 'primary-btn', this.div, "Activity Finder");
		this.activityFinderButton.addEventListener('click', () => { openActivityFinder(this.controller); });
		this.buttons.push(this.activityFinderButton);

		this.lootSplitterButton = addElementTxt('button', 'primary-btn', this.div, "Loot Splitter");
		this.lootSplitterButton.addEventListener('click', () => { openLootSplitter(this.controller); });
		this.buttons.push(this.lootSplitterButton);

		this.supportManagerButton = addElementTxt('button', 'primary-btn', this.div, "Support");
		this.supportManagerButton.addEventListener('click', () => { openSupportManager(this.controller); });
		this.buttons.push(this.supportManagerButton);

		this.logoutButton = addElementTxt('button', 'logout primary-btn', this.div, "Logout");
		this.logoutButton.addEventListener('click', () => { location.href="./php/users/logout.php"; });
		this.buttons.push(this.logoutButton);

		this.animateButtons();

	}

	start() {
		//called by controller after loading user's characters
		if (this.controller.power == 0) {
			if (this.controller.characters.length === 0) {
				new ErrorDisplay(this.controller, "Add at least 1 character to follow activity on your servers.");
			} else {
				openNewsDisplay(this.controller);
			}
		}
	}
	animateButtons() {
		let tline = new TimelineMax();
		this.buttons.forEach((btn) => {
			tline.set(btn, {opacity: 0});
		});
		tline.to(this.div, 0.5, {});
		this.buttons.forEach((btn) => {
			tline.fromTo(btn, 0.4, {left: -50}, {left: 0}, "-=0.3");
			tline.fromTo(btn, 0.3, {opacity: 0.8}, {opacity: 1}, "-=0.3");
		});
	}

}

const startUserInterface = (controller) => {
    return new UserInterface(controller);
}


export { startUserInterface };