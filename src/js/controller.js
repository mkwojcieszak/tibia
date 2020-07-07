$ = jQuery = require('jquery');
import { startAdminInterface } from './adminInterface.js';

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


class Controller {
    constructor(id, login, power) {
        this.id = id;
		this.login = login;
		this.power = power;
        this.openedWindow = 0;
        site.classList.remove('hidden');
        sidepanel.classList.remove('hidden');

        if (this.power > 0) { startAdminInterface(this); }

        this.loadCharacters();
		this.loadServers();
        this.loadActivities();
        this.loadImbuPrices();
        this.loadedCharacters = [];

        this.activityBox = addElementTxt('div', 'activity-box', document.querySelector('#logo-box'), "Inactive");
        this.activityBox.addEventListener('click', () => { this.refreshCheck(); })
    }

    refreshCheck() {
        this.activityBox.classList.add('fresh');
        this.activityBox.innerHTML = "Active";
        setTimeout(() => {
            this.activityBox.classList.remove('fresh');
            this.activityBox.innerHTML = "Inactive";
        }, 6000);

        $.ajax({
            type: "POST",
			dataType: "JSON",
			url: "./php/activities/refreshUserActivities.php",
			data: {},
			success: (ret) => {
				if (ret.fb == 'success') {
                    //
				} else {
					alert(ret.fb);
				}
			}
        })
    }

    setOpenedWindow(new_window) {
		if (this.openedWindow != 0) {
			this.openedWindow.close();
		}
		this.openedWindow = new_window;
    }
    
    loadServers() {
		this.serverIds = [];
		this.serverNames = [];
		let interf = this;
		$.ajax({
			type: "POST",
			dataType: "JSON",
			url: "./php/loadServersList.php",
			data: {},
			success: (ret) => {
				if (ret.fb == 'success') {
					ret.servers.forEach((serv) => {
						interf.serverIds.push(serv.id);
						interf.serverNames.push(serv.name);
					});
				} else {
					alert(ret.fb);
				}
			}
		});
	}

	loadActivities() {
		this.activityIds = [];
		this.activityNames = [];
		this.activityTypes = [];
		let interf = this;
		$.ajax({
			type: "POST",
			dataType: "JSON",
			url: "./php/loadActivities.php",
			data: {},
			success: (ret) => {
				if (ret.fb == 'success') {
					ret.activities.forEach((act) => {
						interf.activityIds.push(act.id);
						interf.activityNames.push(act.name);
						interf.activityTypes.push(act.type);
					});
				} else {
					alert(ret.fb);
				}
			}
		});
	}

	loadCharacters() {
		this.characters = [];
		let interf = this;
		$.ajax({
			type: "POST",
			dataType: "JSON",
			url: "./php/characters/loadCharacters.php",
			data: {},
			success: (ret) => {
				if (ret.fb == 'success') {
					ret.characters.forEach((char) => {
						interf.addCharacter(char);
                    });
                    interf.userInterface.start();
				} else {
					alert(ret.fb);
				}
			}
		});
	}

    getCharacter(id) {
        let ret = false;
        this.loadedCharacters.forEach((char) => {
            if (char.id == id) { ret = char }
        });
        return ret;
    }

	addCharacter(character) {
        //Adds user own character
        if (character.user_id == this.id) {
            this.characters.push(character);
        }
        this.loadedCharacters.push(character);
	}

	removeCharacter(character) {
		let ind = this.characters.indexOf(character);
        this.characters.splice(ind, 1);
    }
    
    getActivityName(id) {
        let ret = false;
        this.activityIds.forEach((aid, aind) => {
            if (this.activityIds[aind] == id) { ret = this.activityNames[aind]; }
        });
        return ret;
    }

    loadImbuPrices() {
        this.imbuPrices = [];
        let mg = this;
        $.ajax({
            type: "POST",
			dataType: "JSON",
			url: "./php/userImbuPrices/loadImbuPrices.php",
			data: {},
            success: (ret) => {
                if (ret.fb =='success') {
                    ret.imbuPrices.forEach((imbu) => { mg.addImbuPrices(imbu); });
                }
            }
        })
    }

    addNewImbuPrices(serv) {
        let mg = this;
        let srv = serv;
        $.ajax({
            type: "POST",
			dataType: "JSON",
			url: "./php/userImbuPrices/addImbuPrices.php",
			data: {server: srv},
            success: (ret) => {
                if (ret.fb =='success') {
                    mg.addImbuPrices(ret.imbuPrices);
                }
            }
        })

    }

    addImbuPrices(imbu) {
        this.imbuPrices.push(imbu);
    }

    removeImbuPrices(imbu) {
        let ind = this.imbuPrices.indexOf(imbu);
        this.imbuPrices.splice(ind, 1);
    }

    updateImbuPrices(imb) {
        //script called by ImbuPricesManager
        let ind = -1;
        this.imbuPrices.forEach((im, i) => {
            if (im.id = imb.id) { ind = i }
        });
        this.imbuPrices[ind] = imb;

        let mg = this;
        let imbu = imb;

        $.ajax({
            type: "POST",
			dataType: "JSON",
			url: "./php/userImbuPrices/updateImbuPrices.php",
            data: {
                id: imbu.id,
                lifesteal1: imbu.lifesteal1,
                lifesteal2: imbu.lifesteal2,
                lifesteal3: imbu.lifesteal3,
                manaleech1: imbu.manaleech1,
                manaleech2: imbu.manaleech2,
                manaleech3: imbu.manaleech3,
                crit1: imbu.crit1,
                crit2: imbu.crit2,
                crit3: imbu.crit3,
                token: imbu.token
            },
            success: (ret) => {
                if (ret.fb =='success') {
                    // do nothing
                }
            }
        })
        
    }

}

const openController = (id, login, power) => {
    return new Controller(id, login, power);
}


export { openController };