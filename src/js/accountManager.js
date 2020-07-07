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


class AccountManager {
    constructor(userInterface) {
        /*
        Characters:
        charList
        addChar

        Followed Servers:



        */
        this.userInterface = userInterface;
        this.div = addElement('div', 'account-manager', site);


        this.charactersTitle = addElementTxt('h3', '', this.div, "Characters");
        this.charactersList = addElement('h3', 'list', this.div);


        this.serversTitle = addElementTxt('h3', '', this.div, "Servers");
        this.serversList = addElement('h3', 'list', this.div);


        this.filtersTitle = addElementTxt('h3', '', this.div, "Filters");
        this.filtersList = addElement('h3', 'list', this.div);
    }

    close() {

    }
}

const openAccountManager = (userInterface) => {
    return new AccountManager(userInterface);
}

export { openAccountManager };