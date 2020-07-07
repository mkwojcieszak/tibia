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

class ManagerActivity {
    constructor(manager, id, character, activity, last_check) {
        this.manager = manager;
        this.id = id;
        this.character = character;
        this.activity = activity;
        this.last_check = last_check;
        let arr = this.character.profession.split(" ");
        this.short_prof = arr[arr.length-1];
        //this.txt = `<span class=''>${ this.character.name }</span> (<span class=''>${ this.character.level } ${ this.character.profession }</span>) is looking for <span class=''>${ this.activity.name } </span> on <span class=''>${ this.character.server }</span>`;
        this.div = addElement('div', 'activity-statement', this.manager.actList);
        this.deleteButton = addElementTxt('button', 'delete', this.div, "X");
        this.deleteButton.addEventListener('click', () => { this.delete(); })
        this.nameE = addElementTxt('span', 'link ' + this.short_prof, this.div, this.character.name);
        this.filler1 = addElementTxt('span', '', this.div, ` (${ this.character.level } ${ this.short_prof }</span>) is looking for `);
        //this.levelE = addElementTxt('span', 'link', this.div, this.character.level);
        //this.filler2 = addElementTxt('span', '', this.div, " ");
        //this.professionE = addElementTxt('span', 'link', this.div, this.character.profession);
        //this.filler3 = addElementTxt('span', '', this.div, ") is looking for ");
        this.activityE = addElementTxt('span', 'link', this.div, this.activity.name);
        this.filler4 = addElementTxt('span', '', this.div, " on ");
        this.serverE = addElementTxt('span', 'link', this.div, this.character.server);
        this.filer5 = addElementTxt('span', '', this.div, ".");
    
    }

    delete() {
        let act = this;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/activities/deleteUserActivity.php",
            data: {id: act.id},
            success: (ret) => {
                if (ret.fb == "success") {
                    act.close();
                } else {
                    alert(ret.fb);
                }
            }
        })
    }

    close() {
        this.div.parentNode.removeChild(this.div);
        delete this;
    }
}




class ActivityManager {
    constructor(controller) {
        controller.setOpenedWindow(this);
        this.controller = controller;
        // allows user to create new activities
        this.div = addElement('div', 'manager-window', site);
        this.title = addElementTxt('h3', 'page-title', this.div, "My Activities");
        this.actList = addElement('div', 'column-list shadow-box max', this.div);
        this.newActivityDiv = addElement('div', 'column-list shadow-box max', this.div);

        this.newTitle = addElementTxt('h3', '', this.newActivityDiv, "Add Activity");
        this.characterRow = addElementTxt('div', 'flex-div', this.newActivityDiv, "<p class='input-label'>Character:</p>");
        this.newCharacterSelector = addElement('select', '', this.characterRow);
        this.newCharacterSelector.focus();

        this.typeRow = addElementTxt('div', 'flex-div', this.newActivityDiv, "<p class='input-label'>Type:</p>");
        this.newTypeSelector = addElementTxt('button', '', this.typeRow, "Quest");

        this.activityRow = addElementTxt('div', 'flex-div', this.newActivityDiv, "<p class='input-label'>Activity:</p>");
        this.newQuestSelector = addElement('select', '', this.activityRow);
        this.newBossSelector = addElement('select', 'hidden', this.activityRow);

        this.feedbackDiv = addElement('div', 'feedback', this.newActivityDiv);

        this.newActivityButton = addElementTxt('button', '', this.newActivityDiv, "Add");
        this.newActivityButton.addEventListener('click', () => { this.addActivity(); })

        this.newType = "Quest";

        this.newTypeSelector.addEventListener('click', () => {
            if (this.newType == "Quest") {
                this.newType = "Boss";
                this.newTypeSelector.innerHTML = "Boss";
                this.newQuestSelector.classList.add('hidden');
                this.newBossSelector.classList.remove('hidden');
            } else {
                this.newType = "Quest";
                this.newTypeSelector.innerHTML = "Quest";
                this.newQuestSelector.classList.remove('hidden');
                this.newBossSelector.classList.add('hidden');
            }
        });

        controller.characters.forEach((char) => {
            let opt = addElement('option', '', this.newCharacterSelector);
            opt.textContent = char.name;
            opt.value = char.id;
        });

        controller.activityIds.forEach((id, index) => {
            let opt = addElement('option', '', this.newQuestSelector);
            if (controller.activityTypes[index] == "Boss") {
                this.newBossSelector.appendChild(opt);
            }
            opt.textContent = controller.activityNames[index];
            opt.value = controller.activityIds[index];
        });

        this.loadActivities();
    }

    addActivity() {
        let manager = this;
        let char_id = manager.newCharacterSelector.value;
        let act_id = manager.newQuestSelector.value;
        if (manager.newType === "Boss") {
            act_id = manager.newBossSelector.value;
        }
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/activities/addUserActivity.php",
            data: {character_id: char_id, activity_id: act_id},
            success: (ret) => {
                switch(ret.fb) {
                    case "already exists":
                        //
                    break;
                    case "no ownership":
                        //
                    break;
                    case "character does not exist":
                        //
                    break;
                    case "missing data":
                        //
                    break;
                    case "success":
                        new ManagerActivity(manager, ret.id, ret.character, ret.activity, ret.server, ret.last_check);
                    break;

                }
            }
        })

    }

    loadActivities() {
        let manager = this;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/activities/loadUserActivities.php",
            data: {},
            success: (ret) => {
                if (ret.fb == 'success') {
                    ret.activities.forEach((activity) => {
                        new ManagerActivity(manager, activity.id, activity.character, activity.activity, activity.server, activity.last_check);
                    });
                }
            }
        })
    }

    close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openActivityManager = (controller) => {
    return new ActivityManager(controller);
}


export { openActivityManager };