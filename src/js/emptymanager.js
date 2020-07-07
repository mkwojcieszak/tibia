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


class HuntManager {
    constructor(controller) {
        // controller is a class which contains: 
        this.controller = controller;
	}
	
	close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openHuntManager = (controller) => {
    return new HuntManager(controller);
}


export { openHuntManager };