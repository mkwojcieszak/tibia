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

class NoNewsPrompt {
    constructor(newsdisplay) {
        this.newsdisplay = newsdisplay;
        this.div = addElementTxt('div', 'activity-statement', this.newsdisplay.actList, "No recent activity on your servers.");
    }
}

class NewsActivity {
    constructor(newsdisplay, activity) {
        this.newsdisplay = newsdisplay;
        this.controller = newsdisplay.controller;
        this.activity = activity;

        this.activity.name = this.newsdisplay.controller.getActivityName(this.activity.activity_id);
        //let arr = this.character.profession.split(" ");
        //this.short_prof = arr[arr.length-1];
        //this.txt = `<span class=''>${ this.character.name }</span> (<span class=''>${ this.character.level } ${ this.character.profession }</span>) is looking for <span class=''>${ this.activity.name } </span> on <span class=''>${ this.character.server }</span>`;
        this.div = addElement('div', 'activity-statement', this.newsdisplay.actList);
        this.nameE = addElementTxt('span', 'link ', this.div, "...");
        this.filler1 = addElementTxt('span', '', this.div, ` (...) is looking for `);
        this.activityE = addElementTxt('span', 'link', this.div, "...");
        this.filler4 = addElementTxt('span', '', this.div, " on ");
        this.serverE = addElementTxt('span', 'link', this.div, "...");
        this.filer5 = addElementTxt('span', '', this.div, ".");

        this.setCharacter(this.activity.character);
        //this.loadCharacter();
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

class NewsDisplay {
    constructor(controller) {
        // controller is a class which contains:
        controller.setOpenedWindow(this);
        this.controller = controller;
    
        /*
        get char list, make servers list, for every server load
        */

       this.div = addElement('div', 'manager-window', site);
       this.title = addElementTxt('h3', 'page-title', this.div, "News");
       this.actList = addElement('div', 'column-list shadow-box max', this.div);

        this.loadNews();
    }
    
    loadNews() {
        let nd = this;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/activities/loadNews.php",
            data: {},
            success: (ret) => {
                if (ret.fb === "success") {
                    if (ret.servers.length < 1) {
                        //new ErrorDisplay(nd.controller, "Add at least 1 character to follow activity on your servers.");
                    } else {
                        if (ret.activities.length > 0) {
                            ret.activities.forEach((act) => { new NewsActivity(nd, act); });
                        } else {
                            new NoNewsPrompt(nd);
                        }
                    }
                }
            }
        })
    }
    
	close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openNewsDisplay = (controller) => {
    return new NewsDisplay(controller);
}


export { openNewsDisplay };