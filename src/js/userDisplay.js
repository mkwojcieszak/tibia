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
const wrap = document.querySelector('#wrapper');

class UserDisplay {
    constructor(controller, user_id) {
        // controller is a class which contains: 
        this.user_id = user_id;
        this.controller = controller;

        /*
         Functionality:
         Shows all characters of that user in 1 tab
         Shows all activities in other tab
        //// let people write mails to each other
        //// his imbu prices with ability to copy? but thats extra++
        */
       this.div = addElement('div', '', wrap);
       this.blocker = addElement('div', '', wrap);
       this.closeButton = addElement('button', '', this.div);

       this.leftSide = addElement('div', 'side', this.div);
       this.rightSide = addElement('div', 'side right', this.div);
       this.loginDiv = addElementTxt('div', '', this.leftSide, "Loading...");
       this.charList = addElement('div', '', this.leftSide);
       this.actiList = addElement('div', '', this.rightSide);

	}
	
	close() {
        this.cover.parentNode.removeChild(this.cover);
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openUserDisplay = (controller) => {
    return new UserDisplay(controller);
}


export { openUserDisplay };