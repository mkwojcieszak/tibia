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


class FinderActivity {
    constructor(finder, activity) {
        this.finder = finder;
        this.controller = finder.controller;
        this.activity = activity;

        this.activity.name = this.finder.controller.getActivityName(this.activity.activity_id);
        //let arr = this.character.profession.split(" ");
        //this.short_prof = arr[arr.length-1];
        //this.txt = `<span class=''>${ this.character.name }</span> (<span class=''>${ this.character.level } ${ this.character.profession }</span>) is looking for <span class=''>${ this.activity.name } </span> on <span class=''>${ this.character.server }</span>`;
        this.div = addElement('div', 'activity-statement', this.finder.actList);
        this.nameE = addElementTxt('span', 'link ', this.div, "...");
        this.filler1 = addElementTxt('span', '', this.div, ` (...) is looking for `);
        this.activityE = addElementTxt('span', 'link', this.div, "...");
        this.filler4 = addElementTxt('span', '', this.div, " on ");
        this.serverE = addElementTxt('span', 'link', this.div, "...");
        this.filer5 = addElementTxt('span', '', this.div, ".");

        this.loadCharacter();
        this.setAge();
    }

    setAge() {
        let now = new Date();
        let check_time = new Date(this.activity.last_check);
        let time_diff_mins = (now.getTime() - check_time.getTime()) / 60000;
        if (time_diff_mins < 120) { this.div.classList.add('fresh'); } // refreshed in last 2 hours
        else if (time_diff_mins > (24*60)) { this.div.classList.add('old'); } // older than 1 day
        else { this.div.classList.add('recent'); }
    }

    loadCharacter() {
        // check if character is loaded in manager ad if it isnt load it from database
        let char_id = this.activity.character_id;
        let char = this.controller.getCharacter(char_id);
        if (char == false) {
            let act = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/characters/getCharacter.php",
                data: {id: char_id},
                success: (ret) => {
                    if (ret.fb == "success") {
                        act.controller.addCharacter(ret.character);
                        act.setCharacter(ret.character);
                    } else {
                        alert(ret.fb);
                    }
                }
            })
        } else {
            this.setCharacter(char);
        }
    }

    setCharacter(char) {

        this.character = char;
        let arr = this.character.profession.split(" ");
        this.short_prof = arr[arr.length-1];
        this.nameE.setAttribute('class', 'link ' + this.short_prof);
        this.div.classList.add(this.short_prof);
        this.nameE.innerHTML = this.character.name;

        this.filler1.innerHTML =  ` (${ this.character.level } ${ this.short_prof }</span>) is looking for `;
        this.activityE.innerHTML =  this.activity.name;
        this.serverE.innerHTML = this.character.server;
    }

    close() {
        this.div.parentNode.removeChild(this.div);
		delete this;
    }
}

class ActivityFinder {
    constructor(controller) {
        controller.setOpenedWindow(this);
        this.controller = controller;

        this.div = addElement('div', 'manager-window', site);
        this.title = addElementTxt('h3', 'page-title', this.div, "Activity Finder");
        this.filters = addElement('div', 'column-list shadow-box max', this.div);

        this.filtersDiv = addElement('div', 'wrap-list mbot0', this.filters);

        this.typeRow = addElementTxt('div', 'flex-div', this.filtersDiv, "<p class='input-label'>Type:</p>");
        this.typeSelector = addElementTxt('button', 'w100', this.typeRow, "Quest");

        this.activityRow = addElementTxt('div', 'short-row', this.filtersDiv, "<p class='input-label'>Activity:</p>");

        this.questSelector = addElement('select', 'long-select', this.activityRow);
        this.bossSelector = addElement('select', 'long-select hidden', this.activityRow);
        this.questSelector.focus();

        this.serverRow = addElementTxt('div', 'short-row', this.filtersDiv, "<p class='input-label'>Server:</p>");
        this.serverSelector = addElement('select', '', this.serverRow);

        this.buttonRow = addElement('div', 'long-row', this.filtersDiv);
        this.filtersButton = addElementTxt('button', 'main', this.buttonRow, "Search");
        this.filtersButton.addEventListener('click', () => { this.findActivities(); })

        this.feedbackDiv = addElement('div', 'flex-div splitter', this.filters);

        this.professionFilters = addElement('div', 'wrap-list', this.filters);
        this.knightButton = addElementTxt('button', 'filter-button knight', this.professionFilters, "Knight");
        this.paladinButton = addElementTxt('button', 'filter-button paladin', this.professionFilters, "Paladin");
        this.sorcererButton = addElementTxt('button', 'filter-button sorcerer', this.professionFilters, "Sorcerer");
        this.druidButton = addElementTxt('button', 'filter-button druid', this.professionFilters, "Druid");
        this.knightButton.addEventListener('click', () => { this.toggleProfessionFilter('Knight'); this.knightButton.classList.toggle('toggled'); })
        this.paladinButton.addEventListener('click', () => { this.toggleProfessionFilter('Paladin'); this.paladinButton.classList.toggle('toggled'); })
        this.sorcererButton.addEventListener('click', () => { this.toggleProfessionFilter('Sorcerer'); this.sorcererButton.classList.toggle('toggled'); })
        this.druidButton.addEventListener('click', () => { this.toggleProfessionFilter('Druid'); this.druidButton.classList.toggle('toggled'); })

        this.recencyFilters = addElement('div', 'wrap-list', this.filters);
        this.freshButton = addElementTxt('button', 'filter-button', this.recencyFilters, "Fresh (less than 2h)");
        this.recentButton = addElementTxt('button', 'filter-button', this.recencyFilters, "Medium (from 2h and 24h)");
        this.oldButton = addElementTxt('button', 'filter-button', this.recencyFilters, "Old (older than 24h)");
        this.freshButton.addEventListener('click', () => { this.toggleRecencyFilter('fresh'); this.freshButton.classList.toggle('toggled'); })
        this.recentButton.addEventListener('click', () => { this.toggleRecencyFilter('recent'); this.recentButton.classList.toggle('toggled'); })
        this.oldButton.addEventListener('click', () => { this.toggleRecencyFilter('old'); this.oldButton.classList.toggle('toggled'); })

        this.actList = addElementTxt('div', 'column-list shadow-box max', this.div, "Select filters and press Search to see results");

        this.type = "Quest";
        this.activities = [];

        this.typeSelector.addEventListener('click', () => {
            if (this.type == "Quest") {
                this.type = "Boss";
                this.typeSelector.innerHTML = "Boss";
                this.questSelector.classList.add('hidden');
                this.bossSelector.classList.remove('hidden');
            } else {
                this.type = "Quest";
                this.typeSelector.innerHTML = "Quest";
                this.questSelector.classList.remove('hidden');
                this.bossSelector.classList.add('hidden');
            }
        });

        this.fillFilters();
    }

    toggleProfessionFilter(prof) {
        let prof_divs = document.querySelectorAll('.activity-statement.' + prof);
        prof_divs.forEach((pd) => { pd.classList.toggle('prof-hidden'); });
    }

    toggleRecencyFilter(recency) {
        let rec_divs = document.querySelectorAll('.activity-statement.' + recency);
        rec_divs.forEach((rd) => { rd.classList.toggle('rec-hidden'); });
    }

    fillFilters() {

        let opt = addElement('option', '', this.questSelector);
        opt.textContent = 'All';
        opt.value = 0;

        opt = addElement('option', '', this.bossSelector);
        opt.textContent = 'All';
        opt.value = 0;

        this.controller.activityIds.forEach((id, index) => {
            opt = addElement('option', '', this.questSelector);
            if (this.controller.activityTypes[index] == "Boss") {
                this.bossSelector.appendChild(opt);
            }
            opt.textContent = this.controller.activityNames[index];
            opt.value = this.controller.activityIds[index];
        });

        opt = addElement('option', '', this.serverSelector);
        opt.textContent = 'All';
        opt.value = "none";

        this.controller.serverNames.forEach((serv) => {
            opt = addElement('option', '', this.serverSelector);
            opt.textContent = serv;
            opt.value = serv;
        });
    }

    findActivities() {
        this.feedbackDiv.innerHTML = "";
        let serv = this.serverSelector.value;
        let act = this.questSelector.value;
        if (this.type == "Boss") { act = this.bossSelector.value; }
        if (act == 0 && serv == 0) {
            this.feedbackDiv.innerHTML = "Filters not strict enough.";
        } else {
            //destroy existing activities
            this.activities.forEach((act) => { act.close(); });
            this.actList.innerHTML = "";
            this.activities = [];

            //reset profession filters
            this.knightButton.classList.remove('toggled');
            this.paladinButton.classList.remove('toggled');
            this.sorcererButton.classList.remove('toggled');
            this.druidButton.classList.remove('toggled');
            this.freshButton.classList.remove('toggled');
            this.recentButton.classList.remove('toggled');
            this.oldButton.classList.remove('toggled');


            let fin = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/activities/findActivitiesByFilters.php",
                data: {server: serv, activity: act},
                success: (ret) => {
                    if (ret.fb == "success") {
                        ret.activities.forEach((act) => { fin.activities.push(new FinderActivity(fin, act)); });
                    } else {
                        fin.feedbackDiv.innerHTML = ret.fb;
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

const openActivityFinder = (controller) => {
    return new ActivityFinder(controller);
}


export { openActivityFinder };