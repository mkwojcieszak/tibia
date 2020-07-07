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

const wpage = document.querySelector('#welcome');

class LoginForm {
	constructor(controller) {
        this.controller = controller;
		//this.controller.setOpenedForm(this);
		this.div = addElement('div', 'login-form hidden', wpage);
		this.t1 = addElementTxt('h3', 'tag', this.div, "Login:");
        this.loginInput = addElement('input', 'login-input mbot20', this.div);
        this.t2 = addElementTxt('h3', 'tag', this.div, "Password:");
        this.passwordInput = addElement('input', 'login-input', this.div);
		this.passwordInput.setAttribute('type', 'password');
		
		this.feedbackDiv = addElement('div', 'feedback hidden', this.div);
		this.loginButton = addElementTxt('button', 'mtop20 mbot20 round-button', this.div, "Login");
		
		this.loginButton.addEventListener('click', () => { this.login(); });

		this.loginInput.addEventListener('keydown', (e) => {
			if (e.keyCode == 13) { this.login(); }
		});

		this.passwordInput.addEventListener('keydown', (e) => {
			if (e.keyCode == 13) { this.login(); }
		});

        this.loginInput.focus();
	}

	login() {
		let interf = this;
        interf.feedbackDiv.setAttribute('class', 'feedback');
        let login = this.loginInput.value;
        let password = this.passwordInput.value;
        if (login.length < 1 || password.length < 1) {
            interf.feedbackDiv.innerHTML = "Login or password is too short.";
            interf.feedbackDiv.setAttribute('class', 'feedback red');
        } else {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "./php/users/authenticateUser.php",
                data: {login: login, password: password},
                success: (ret) => {
                    if (ret.fb == "wrong credentials") {
                        interf.feedbackDiv.innerHTML = "Wrong login or password.";
                        interf.feedbackDiv.setAttribute('class', 'feedback red');
                    } else if (ret.fb == "success") {
                        location.href='./index.html';
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

class CreateAccountForm {
	constructor(controller) {
        this.controller = controller;
		//this.controller.setOpenedForm(this);
        this.div = addElement('div', 'login-form hidden', wpage);

        this.t3 = addElementTxt('h3', 'tag mtop20', this.div, "Login:");
        this.newLoginInput = addElement('input', 'login-input', this.div);
        this.loginFb = addElement('div', 'small-feedback hidden', this.div);

        this.t4 = addElementTxt('h3', 'tag mtop20', this.div, "Password:");
        this.password1Input = addElement('input', 'login-input', this.div);
        this.password1Input.setAttribute('type', 'password');
        this.pass1Fb = addElement('div', 'small-feedback hidden', this.div);

        this.t5 = addElementTxt('h3', 'tag mtop20', this.div, "Repeat Password:");
        this.password2Input = addElement('input', 'login-input', this.div);
        this.password2Input.setAttribute('type', 'password');
        this.pass2Fb = addElement('div', 'small-feedback hidden', this.div);

        this.t6 = addElementTxt('h3', 'tag mtop20', this.div, "Email:");
        this.emailInput = addElement('input', 'login-input', this.div);
        this.emailFb = addElement('div', 'small-feedback hidden', this.div);

        this.finalFb = addElement('div', 'feedback hidden', this.div);

        this.createButton = addElementTxt('button', 'mtop20 mbot20 round-button', this.div, "Create");

        this.createButton.addEventListener('click', () => { this.create(); });

        this.newLoginInput.focus();
	}

    create() {
        let err = false;
        let interf = this;
        this.loginFb.classList.add('hidden');
        this.pass1Fb.classList.add('hidden');
        this.pass2Fb.classList.add('hidden');
        this.emailFb.classList.add('hidden');
        this.finalFb.classList.add('hidden');

        let login = this.newLoginInput.value;
        let password = this.password1Input.value;
        let password2 = this.password2Input.value;
        let email = this.emailInput.value;

        if (password != password2) {
            err = true;
            this.pass2Fb.innerHTML = "Passwords do not match.";
            this.pass2Fb.classList.remove('hidden');
        }
        if (login.length < 3) {
            err = true;
            this.loginFb.innerHTML = "Login is too short.";
            this.loginFb.classList.remove('hidden');
        }
        if (password.length < 5) {
            err = true;
            this.pass1Fb.innerHTML = "Password is too short.";
            this.pass1Fb.classList.remove('hidden');
        }
        if (email.length < 5) {
            err = true;
            this.emailFb.innerHTML = "Email is too short.";
            this.emailFb.classList.remove('hidden');
        }
        if (err === false) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "./php/users/createUser.php",
                data: {login: login, password: password, email: email},
                success: (ret) => {
                    
                    if (ret.fb == "login taken") {
                        interf.finalFb.innerHTML = "Login already taken.";
                        interf.finalFb.classList.remove('hidden');
                    } else if (ret.fb == "missing data") {
                        interf.finalFb.innerHTML = "Missing data.";
                        interf.finalFb.classList.remove('hidden');
                    } else if (ret.fb == "success") {
                        //php script already started session.
                        location.href='index.html';
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

class CreateAccountCenterForm {
    constructor(controller) {
        this.controller = controller;
		//this.controller.setOpenedForm(this);
        this.div = addElement('div', 'login-form center', wpage);

        this.t3 = addElementTxt('h3', 'tag mtop20', this.div, "Login:");
        this.newLoginInput = addElement('input', 'login-input', this.div);
        this.loginFb = addElement('div', 'small-feedback hidden', this.div);

        this.t4 = addElementTxt('h3', 'tag mtop20', this.div, "Password:");
        this.password1Input = addElement('input', 'login-input', this.div);
        this.password1Input.setAttribute('type', 'password');
        this.pass1Fb = addElement('div', 'small-feedback hidden', this.div);

        this.t5 = addElementTxt('h3', 'tag mtop20', this.div, "Repeat Password:");
        this.password2Input = addElement('input', 'login-input', this.div);
        this.password2Input.setAttribute('type', 'password');
        this.pass2Fb = addElement('div', 'small-feedback hidden', this.div);

        this.t6 = addElementTxt('h3', 'tag mtop20', this.div, "Email:");
        this.emailInput = addElement('input', 'login-input', this.div);
        this.emailFb = addElement('div', 'small-feedback hidden', this.div);

        this.finalFb = addElement('div', 'feedback hidden', this.div);

        this.createButton = addElementTxt('button', 'mtop20 mbot20 round-button', this.div, "Create");

        this.createButton.addEventListener('click', () => { this.create(); });

        this.newLoginInput.focus();
	}

    create() {
        let err = false;
        let interf = this;
        this.loginFb.classList.add('hidden');
        this.pass1Fb.classList.add('hidden');
        this.pass2Fb.classList.add('hidden');
        this.emailFb.classList.add('hidden');
        this.finalFb.classList.add('hidden');

        let login = this.newLoginInput.value;
        let password = this.password1Input.value;
        let password2 = this.password2Input.value;
        let email = this.emailInput.value;

        if (password != password2) {
            err = true;
            this.pass2Fb.innerHTML = "Passwords do not match.";
            this.pass2Fb.classList.remove('hidden');
        }
        if (login.length < 3) {
            err = true;
            this.loginFb.innerHTML = "Login is too short.";
            this.loginFb.classList.remove('hidden');
        }
        if (password.length < 5) {
            err = true;
            this.pass1Fb.innerHTML = "Password is too short.";
            this.pass1Fb.classList.remove('hidden');
        }
        if (email.length < 5) {
            err = true;
            this.emailFb.innerHTML = "Email is too short.";
            this.emailFb.classList.remove('hidden');
        }
        if (err === false) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "./php/users/createUser.php",
                data: {login: login, password: password, email: email},
                success: (ret) => {
                    
                    if (ret.fb == "login taken") {
                        interf.finalFb.innerHTML = "Login already taken.";
                        interf.finalFb.classList.remove('hidden');
                    } else if (ret.fb == "missing data") {
                        interf.finalFb.innerHTML = "Missing data.";
                        interf.finalFb.classList.remove('hidden');
                    } else if (ret.fb == "success") {
                        //php script already started session.
                        location.href='index.html';
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

class WelcomePage {
    constructor(controller) {
        // controller is a class which contains: 
        this.controller = controller;
        wpage.classList.remove('hidden');
        this.div = addElement('div', 'welcome-page', wpage);

        this.menu = addElement('nav', 'welcome-menu', this.div);

        this.loginButton = addElementTxt('button', 'login-button', this.menu, "Login");
        this.createButton = addElementTxt('button', 'create-button', this.menu, "Create Account");

        this.openedForm = 0;
        this.loginForm = new LoginForm(this.controller);
        this.createAccountForm = new CreateAccountForm(this.controller);
        this.loginButton.addEventListener('click', () => { this.openForm('login'); });
        this.createButton.addEventListener('click', () => { this.openForm('create'); });

        //this.logoDiv = addElementTxt('div', 'logo', this.div, "<img src='./images/logo.gif'>");
        this.centerDiv = addElement('div', 'center', this.div);
        this.logo = addElementTxt('div', '', this.centerDiv, "<img src='src/images/logo.gif'>");
        this.mainTitle = addElementTxt('h1', '', this.centerDiv, "Welcome to <b>TibiaToolkit</b>");
        this.contentButton = addElementTxt('button', '', this.centerDiv, "What is this website?");
        this.contentButton.addEventListener('click', () => { this.showContent(); });

        this.contentDiv = addElement('div', 'content', this.div);
        this.contentTxt = addElementTxt('h1', 'content-title', this.contentDiv, "TibiaToolkit provides useful tools such as:");
        this.toolsDiv = addElement('div', 'tools', this.contentDiv);
        //this.bulletsDiv = addElement('div', 'bullets-container', this.div);

        this.toolWrapper1 = addElement('div', 'tool-wrapper', this.toolsDiv);
        this.toolWrapper2 = addElement('div', 'tool-wrapper', this.toolsDiv);
        this.toolWrapper3 = addElement('div', 'tool-wrapper', this.toolsDiv);

        this.tool1 = addElement('div', 'tool', this.toolWrapper1);
        this.tool2 = addElement('div', 'tool main', this.toolWrapper2);
        this.tool3 = addElement('div', 'tool', this.toolWrapper3);

        this.t1 = addElementTxt('h3', 'tool-title', this.tool1, "Loot<br>Splitter");
        this.t2 = addElementTxt('h3', 'tool-title', this.tool2, "Activity<br>Finder");
        this.t3 = addElementTxt('h3', 'tool-title', this.tool3, "Imbuements<br>Calculator");

        this.showcaseDiv = addElement('div', 'showcase-div', this.contentDiv);
        this.contentCreateDiv = addElement('div', 'content-create-div', this.contentDiv);
        this.contentCreateButton = addElementTxt('button', '', this.contentCreateDiv, "Create Account");
        this.contentCreateButton.addEventListener('click', () => { this.openCreateAccountCenterForm(); })

        this.openedShowcase = -1;
        this.showcases = [];
        this.showcases.push(addElement('div', 'tool-showcase hidden', this.showcaseDiv));
        this.showcases.push(addElement('div', 'tool-showcase hidden', this.showcaseDiv));
        this.showcases.push(addElement('div', 'tool-showcase hidden', this.showcaseDiv));

        this.showcases[0].lside = addElementTxt('div', 'side', this.showcases[0], "<h3>Loot Splitter</h3>Calculates your party's profit and splits the gold fairly between members.");
        this.showcases[0].rside = addElementTxt('div', 'side', this.showcases[0], `<div class='img-box' style="background: url('./src/images/party.png');"></div>`);
        this.showcases[1].lside = addElementTxt('div', 'side', this.showcases[1], "<h3>Activity Finder</h3>Allows you to find people on your servers who wants to do the same Quests and Bosses as you are.");
        this.showcases[1].rside = addElementTxt('div', 'side', this.showcases[1], `<div class='img-box' style="background: url('./src/images/group-img.jpg'); box-shadow: 0 0 5px #00000040, 0 0 10px #00000040, 0 0 20px #00000040;"></div>`);
        this.showcases[2].lside = addElementTxt('div', 'side', this.showcases[2], "<h3>Imbuements Calculator</h3>Tells you which enchantments are cheaper when bought with golden tokens or creature products. Also shows total and per hour cost of your imbuments.");
        this.showcases[2].rside = addElementTxt('div', 'side', this.showcases[2], `<div class='img-box' style="background: url('./src/images/party.png');"></div>`);
        this.tool1.addEventListener('click', () => { this.openTool(0); });
        this.tool2.addEventListener('click', () => { this.openTool(1); });
        this.tool3.addEventListener('click', () => { this.openTool(2); });

        this.newAccForm = 0;
        this.openedForm = 'none';
	}
    
    openForm(fo) {
        if (fo == 'login') {
            this.createAccountForm.div.classList.add('hidden');
            if (this.openedForm != 'login') {
                this.loginForm.div.classList.remove('hidden');
                this.loginForm.loginInput.focus();
                this.openedForm = 'login';
            } else {
                this.loginForm.div.classList.add('hidden');
                this.openedForm = 'none';
            }

        } else if (fo == 'create') {
            this.loginForm.div.classList.add('hidden');
            if (this.openedForm != 'create' && this.newAccForm == 0) {
                this.createAccountForm.div.classList.remove('hidden');
                this.createAccountForm.newLoginInput.focus();
                this.openedForm = 'create';
            } else {
                this.createAccountForm.div.classList.add('hidden');
                this.openedForm = 'none';
            }
        }
    }
    showContent() {
        let tl = new TimelineMax();
        tl
            .to(this.contentDiv, 0.8, {top: "50vh"})
            .to(this.contentDiv, 1, {width: "80%"}, "+=0.2")
            .to(this.mainTitle, 1, {opacity: 0}, "-=1.8")
            .to(this.logo, 1, {opacity: 0}, "-=1.8")
            .to(this.contentButton, 0.1, {opacity: 0}, "-=1.8")
            .to(this.contentButton, 0.1, {scaleY: 0}, "-=1.8")

            .to(this.contentTxt, 1.2, {opacity: 1})

            .fromTo(this.toolWrapper1, 0.8, {opacity: 0, rotation: -360}, {opacity: 1, rotation: 0}, "-=0.2")
            .fromTo(this.toolWrapper3, 0.8, {opacity: 0, rotation: -360}, {opacity: 1, rotation: 0}, "+=0.2")
            .fromTo(this.toolWrapper2, 1, {opacity: 0, rotation: -360}, {opacity: 1, rotation: 0}, "+=0.2")

            .to(this.contentCreateButton, 0.8, {opacity: 1}, "+=0.2")
            //.to(this.contentDiv, 0.8, {backgroundSize: "100%"}, "+=0.2")
        ;
    }

    openTool(index) {
        if (this.openedShowcase === -1) {
            //do animations
            this.openedShowcase = index;
            this.showcases[this.openedShowcase].classList.remove('hidden');

            let tl = new TimelineMax();
            tl
                .to(this.contentTxt, 0.5, {opacity: 0})
                .to(this.contentTxt, 1.5, {scaleY: 0, height: "0"}, "-=0.5")
                .to(this.showcaseDiv, 1.5, {scaleY: 1, height: "50%"}, "-=2")
                .to(this.toolsDiv, 1.5, {scaleY: 0.5, scaleX: 0.5, height: "30%"}, "-=2")
            ;
        } else {
            this.showcases[this.openedShowcase].classList.add('hidden');
            this.openedShowcase = index;
            this.showcases[this.openedShowcase].classList.remove('hidden');
        }
    }

    openCreateAccountCenterForm() {
        if (this.newAccForm === 0) { this.newAccForm = new CreateAccountCenterForm(this); }
        this.newAccForm.newLoginInput.focus();
        this.createAccountForm.div.classList.add('hidden');
        let tln = new TimelineMax();
        tln
            .to(this.contentDiv, 0.8, {top: "150vh"})
            .to(this.newAccForm.div, 0.8, {top: "50vh"}, "-=0.8")
        ;

    }
    
	close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openWelcomePage = (controller) => {
    return new WelcomePage(controller);
}


export { openWelcomePage };