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


class SupportManager {
    constructor(controller) {
        // controller is a class which contains: 
        // support by sending feedback / suggestion or donate
        controller.setOpenedWindow(this);
        this.controller = controller;
        
		this.div = addElement('div', 'manager-window', site);
		this.title = addElementTxt('h3', 'page-title', this.div, "Support");
		this.contentDiv = addElement('div', 'shadow-box flex-column aic max', this.div);
		this.fbTitle = addElementTxt('h3', '', this.contentDiv, "Have any suggestions or questions?<br> Contact us!");
		this.fbMessage = addElement('textarea', 'mtop20 mbot10', this.contentDiv);
		this.fbLength = addElementTxt('p', 'lenth-counter red mbot20', this.contentDiv, "(0/500)");
		this.fbButton = addElementTxt('button', 'main mbot20 toggled', this.contentDiv, "Send Message");
		this.feedbackDiv = addElement('div', 'hidden mbot20', this.contentDiv);
		this.fbMessage.focus();

		this.fbMessage.addEventListener('keyup', () => {
			let len = this.fbMessage.value.length;
			this.feedbackDiv.innerHTML = "";
			this.feedbackDiv.setAttribute('class', 'hidden mbot20')
			this.fbLength.innerHTML = `(${ len }/500)`;
			if (len > 500 || len < 10) {
				this.fbLength.classList.add('red');
				this.fbButton.classList.add('toggled');
			} else {
				this.fbLength.classList.remove('red');
				this.fbButton.classList.remove('toggled');
			}
		});

		this.fbButton.addEventListener('click', () => { this.send(); });
	}
	
	send() {
		this.setFeedback(0, '');
		let msg = this.fbMessage.value;
		if (msg.length < 10) {
			this.setFeedback(-1, "Message has to be at least 10 characters long.");
		} else if (msg.length > 500) {
			this.setFeedback(-1, "Message is too long.");
		} else {
			let mg = this;
			$.ajax({
				type: "POST",
				dataType: "JSON",
				url: "./php/tickets/addticket.php",
				data: {message: msg},
				success: (ret) => {
					if (ret.fb == "success") {
						this.setFeedback(1, "Message has been sent.");
					} else {
						this.setFeedback(-1, ret.fb);
					}
				}
			})
		}
	}

	setFeedback(value, text) {
		this.feedbackDiv.setAttribute('class', 'mbot20');
		this.feedbackDiv.innerHTML = text;
		if(value === 1) {
			this.feedbackDiv.classList.add('positive');
		} else if (value === -1) {
			this.feedbackDiv.classList.add('negative');
		} else {
			this.feedbackDiv.classList.add('hidden');
		}
	}

	close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openSupportManager = (controller) => {
    return new SupportManager(controller);
}


export { openSupportManager };