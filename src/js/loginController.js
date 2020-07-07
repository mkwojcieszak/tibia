$ = jQuery = require('jquery');
// import {TweenMax, TimelineMax, CSSPlugin, AttrPlugin, BezierPlugin, TweenPlugin } from "gsap/all";
import { openWelcomePage } from './welcomePage.js';

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
const wpage = document.querySelector('#welcome');


class LoginController {
    constructor() {
        this.openedWindow = 0;

        //this.activityBox = addElementTxt('div', 'activity-box', document.querySelector('#logo-box'), "Inactive");
		//this.activityBox.addEventListener('click', () => { this.refreshCheck(); })
		openWelcomePage(this);
		
			//.fromTo(this.mainTitle, 1, {left:0, opacity:0}, {left:100, opacity:0.5});
			//.fromTo(this.mainTitle, 0.5, { opacity: 0.5, rotation: 360 }, { opacity: 1, rotation: 0 }, "+=0.5")
		this.openedForm = 0;
    }

	setOpenedForm(new_form) {
		if (this.openedForm != 0) {
			this.openedForm.close();
		}
		this.openedForm = new_form;
	}

    setOpenedWindow(new_window) {
		if (this.openedWindow != 0) {
			this.openedWindow.close();
		}
		this.openedWindow = new_window;
	}

}

const openLoginController = () => {
    return new LoginController();
}


export { openLoginController };