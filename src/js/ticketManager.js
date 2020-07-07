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

class TicketBar {
    constructor(manager, ticket) {
        this.manager = manager;
        this.ticket = ticket;
        let txt = this.ticket.message.substr(1, 50);
        this.div = addElementTxt('div', 'activity-statement', this.manager.ticketList, txt);
        if (this.ticket.status  < 1) { this.div.classList.add('fresh'); }
    }

    open() {
        // shows box with full message
    }
}

class TicketManager {
    constructor(controller) {
        // controller is a class which contains:
        controller.setOpenedWindow(this);
        this.controller = controller;
    
        /*
        get char list, make servers list, for every server load
        */

       this.div = addElement('div', 'manager-window', site);
       this.title = addElementTxt('h3', 'page-title', this.div, "Tickets");
       this.ticketList = addElement('div', 'column-list shadow-box max', this.div);

        this.loadTickets();
    }
    
    loadTickets() {
        let nd = this;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/tickets/loadTickets.php",
            data: {},
            success: (ret) => {
                if (ret.fb === "success") {
                    ret.tickets.forEach((tic) => { new TicketBar(nd, tic); });
                }
            }
        })
    }
	
	close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openTicketManager = (controller) => {
    return new TicketManager(controller);
}


export { openTicketManager };