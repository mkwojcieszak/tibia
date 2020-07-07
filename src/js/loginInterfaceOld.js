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

class LoginInterface {
    constructor() {
        this.div = addElement('div', 'login-form', document.querySelector('#interface'));
        // Login Form
        this.t1 = addElementTxt('h3', 'tag', this.div, "Login:");
        this.loginInput = addElement('input', 'login-input mbot20', this.div);
        this.t2 = addElementTxt('h3', 'tag', this.div, "Password:");
        this.passwordInput = addElement('input', 'login-input', this.div);
        this.passwordInput.setAttribute('type', 'password');

        this.feedbackDiv = addElement('div', 'feedback hidden', this.div);
        this.loginButton = addElementTxt('button', 'mtop20 mbot20', this.div, "Login");

        this.newAccVisible = false;
        this.createFormButton = addElementTxt('button', '', this.div, "Create New Account");
        this.createFormButton.addEventListener('click', () => {
            this.div.classList.add('hidden');
            this.newDiv.classList.remove('hidden');
        });


        this.newDiv = addElement('div', 'login-form hidden', document.querySelector('#interface'));

        this.t3 = addElementTxt('h3', 'tag', this.newDiv, "Login:");
        this.newLoginInput = addElement('input', 'login-input mbot20', this.newDiv);
        this.t4 = addElementTxt('h3', 'tag', this.newDiv, "Password:");
        this.password1Input = addElement('input', 'login-input mbot20', this.newDiv);
        this.password1Input.setAttribute('type', 'password');
        this.t5 = addElementTxt('h3', 'tag', this.newDiv, "Repeat Password:");
        this.password2Input = addElement('input', 'login-input mbot20', this.newDiv);
        this.password2Input.setAttribute('type', 'password');
        this.t6 = addElementTxt('h3', 'tag', this.newDiv, "Email:");
        this.emailInput = addElement('input', 'login-input', this.newDiv);

        this.newFeedbackDiv = addElement('div', 'feedback hidden', this.newDiv);
        this.createButton = addElementTxt('button', 'mtop20 mbot20', this.newDiv, "Create Account");

        this.loginFormButton = addElementTxt('button', '', this.newDiv, "Login to an Existing Account");
        this.loginFormButton.addEventListener('click', () => {
            this.newDiv.classList.add('hidden');
            this.div.classList.remove('hidden');
        });

        this.loginButton.addEventListener('click', () => {
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
        });

        this.createButton.addEventListener('click', () => {
            let interf = this;
            interf.newFeedbackDiv.setAttribute('class', 'feedback');
            let login = this.newLoginInput.value;
            let password = this.password1Input.value;
            let password2 = this.password2Input.value;
            let email = this.emailInput.value;
            if (password != password2) {
                interf.newFeedbackDiv.innerHTML = "Passwords do not match.";
                interf.newFeedbackDiv.setAttribute('class', 'feedback red');
            } else if (login.length < 3) {
                interf.newFeedbackDiv.innerHTML = "<br>Login is too short.";
                interf.newFeedbackDiv.setAttribute('class', 'feedback red');
            } else if (password.length < 5) {
                interf.newFeedbackDiv.innerHTML = "<br>Password is too short.";
                interf.newFeedbackDiv.setAttribute('class', 'feedback red');
            } else if (email.length < 5) {
                interf.newFeedbackDiv.innerHTML = "<br>Email is too short.";
                interf.newFeedbackDiv.setAttribute('class', 'feedback red');
            } else {
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "./php/users/createUser.php",
                    data: {login: login, password: password, email: email},
                    success: (ret) => {
                        if (ret.fb == "login taken") {
                            interf.newFeedbackDiv.innerHTML = "Login already taken.";
                            interf.newFeedbackDiv.setAttribute('class', 'feedback red');
                        } else if (ret.fb == "missing data") {
                            interf.newFeedbackDiv.innerHTML = "Missing data.";
                            interf.newFeedbackDiv.setAttribute('class', 'feedback red');
                        } else if (ret.fb == "success") {
                            interf.newFeedbackDiv.innerHTML = "Account created. You can login now.";
                            interf.newFeedbackDiv.setAttribute('class', 'feedback green');
                        }
                    }
                })
            }
        });

    }
}

const startLoginInterface = () => {
    return new LoginInterface();
}


export { startLoginInterface };