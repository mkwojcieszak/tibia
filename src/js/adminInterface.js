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

class TibiaServer {
    constructor(container, id, name) {
        this.id = id;
        this.name = name;
        this.container = container;
        this.div = addElement('div', 'server-div', this.container);
        this.errorDiv = addElement('div', 'feedback-div', this.container);
        this.nameDiv = addElement('input', '', this.div);
        this.nameDiv.value = this.name;
        this.saveButton = addElementTxt('button', '', this.div, "Save");
        this.deleteButton = addElementTxt('button', '', this.div, "Delete");

        this.nameDiv.addEventListener('click', () => { this.errorDiv.innerHTML = ""; });
        this.saveButton.addEventListener('click', () => {
            if (this.nameDiv.value.length < 1) {
                this.errorDiv.innerHTML = "Name is too short";
            } else {
                let tserv = this;
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    url: "./php/admin/editServer.php",
                    data: {id: tserv.id, name: tserv.nameDiv.value},
                    success: (ret) => {
                        if(ret.fb == 'success') {
                            tserv.name = tserv.nameDiv.value;
                            this.errorDiv.innerHTML = "Saved successfuly";
                        } else {
                            alert(ret.fb);
                        }
                    }
                })
            }
        });

        this.deleteButton.addEventListener('click', () => {
            let tserv = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/admin/deleteServer.php",
                data: {id: tserv.id},
                success: (ret) => {
                    if(ret.fb == 'success') {
                        tserv.delete();
                    } else {
                        alert(ret.fb);
                    }
                }
            })
        });
    }

    delete() {
        this.errorDiv.parentNode.removeChild(this.errorDiv);
        this.div.parentNode.removeChild(this.div);
    }
}

class ServersEditor {
	constructor() {
        this.cover = addElement('div', 'window-cover', site);
        this.cover.addEventListener('click', () => { this.close(); })
        this.div = addElement('div', 'front-panel', site);
        this.closeButton = addElementTxt('button', 'close-btn', this.div, "x");
        this.closeButton.addEventListener('click', () => { this.close(); })

        this.titleDiv = addElementTxt('h3', '', this.div, "Servers:");
        this.serversList = addElement('div', 'list', this.div);
        this.newServerButton = addElementTxt('button', '', this.div, "Add Server");

        this.newServerButton.addEventListener('click', () => {
            let editor = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/admin/addServer.php",
                data: {},
                success: (ret) => {
                    if(ret.fb == 'success') {
                        new TibiaServer(editor.serversList, ret.id, ret.name);
                    } else {
                        alert(ret.fb);
                    }
                }
            })
        });
        let editor = this;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/loadServers.php",
            data: {},
            success: (ret) => {
                if(ret.fb == 'success') {
                    ret.servers.forEach((server) => {
                        new TibiaServer(editor.serversList, server.id, server.name);
                    });
                } else {
                    alert(ret.fb);
                }
            }          
        });

	}

	close() {
        this.cover.parentNode.removeChild(this.cover);
        this.div.parentNode.removeChild(this.div);
	}
}

class TibiaActivity {
    constructor(container, id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.container = container;
        this.div = addElement('div', 'activity-div', this.container);
        this.feedbackDiv = addElement('div', 'feedback-div', this.container);
        this.nameDiv = addElement('input', '', this.div);
        this.nameDiv.value = this.name;
        this.typeDiv = addElement('input', '', this.div);
        this.typeDiv.value = this.type;
        this.saveButton = addElementTxt('button', '', this.div, "Save");
        this.deleteButton = addElementTxt('button', '', this.div, "Delete");

        this.nameDiv.addEventListener('click', () => { this.feedbackDiv.innerHTML = ""; });
        this.saveButton.addEventListener('click', () => {
            if (this.nameDiv.value.length < 1) {
                this.feedbackDiv.innerHTML = "Name is too short";
            } else {
                let tact = this;
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    url: "./php/admin/editActivity.php",
                    data: {id: tact.id, name: tact.nameDiv.value, type: tact.typeDiv.value},
                    success: (ret) => {
                        if(ret.fb == 'success') {
                            tact.name = tact.nameDiv.value;
                            tact.type = tact.typeDiv.value;
                            this.feedbackDiv.innerHTML = "Saved successfuly";
                        } else {
                            alert(ret.fb);
                        }
                    }
                })
            }
        });

        this.deleteButton.addEventListener('click', () => {
            let tact = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/admin/deleteActivity.php",
                data: {id: tact.id},
                success: (ret) => {
                    if(ret.fb == 'success') {
                        tact.delete();
                    } else {
                        alert(ret.fb);
                    }
                }
            })
        });
    }

    delete() {
        this.errorDiv.parentNode.removeChild(this.errorDiv);
        this.div.parentNode.removeChild(this.div);
    }
}

class ActivitiesEditor {
	constructor() {
        this.cover = addElement('div', 'window-cover', site);
        this.cover.addEventListener('click', () => { this.close(); })
        this.div = addElement('div', 'front-panel', site);
        this.closeButton = addElementTxt('button', 'close-btn', this.div, "x");
        this.closeButton.addEventListener('click', () => { this.close(); })

        this.titleDiv = addElementTxt('h3', '', this.div, "Activities:");
        this.activitiesList = addElement('div', 'list', this.div);
        this.newActivityButton = addElementTxt('button', '', this.div, "Add Activity");

        this.newActivityButton.addEventListener('click', () => {
            let editor = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/admin/addActivity.php",
                data: {},
                success: (ret) => {
                    if(ret.fb == 'success') {
                        new TibiaActivity(editor.activitiesList, ret.id, ret.name, ret.type);
                    } else {
                        alert(ret.fb);
                    }
                }
            })
        });
        let editor = this;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/loadActivities.php",
            data: {},
            success: (ret) => {
                if(ret.fb == 'success') {
                    ret.activities.forEach((activity) => {
                        new TibiaActivity(editor.activitiesList, activity.id, activity.name, activity.type);
                    });
                } else {
                    alert(ret.fb);
                }
            }          
        });

	}

	close() {
        this.cover.parentNode.removeChild(this.cover);
        this.div.parentNode.removeChild(this.div);
        delete this;
	}
}


class AdminInterface {
	constructor(controller) {
		this.controller = controller;
        this.div = addElement('div', 'admin-panel', site);
		this.serversButton = addElementTxt('button', 'admin-button', this.div, "Servers Editor");
        this.serversButton.addEventListener('click', () => { new ServersEditor(); });

        this.activitiesButton = addElementTxt('button', 'admin-button', this.div, "Activities Editor");
        this.activitiesButton.addEventListener('click', () => { new ActivitiesEditor(); });
        
		this.areasButton = addElementTxt('button', 'admin-button', this.div, "Areas Editor");
        this.areasButton.addEventListener('click', () => { new AreasEditor(); })
        

	}
}

const startAdminInterface = (controller) => {
    return new AdminInterface(controller);
}


export { startAdminInterface };