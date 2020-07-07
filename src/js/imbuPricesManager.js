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


class ManagerImbuPrices {
    constructor(manager, imbuPrices) {
        this.manager = manager;
        this. imbuPrices = imbuPrices;

        this.manager.imbuPrices.push(this);

        this.div = addElement('div', 'imbu-prices-box shadow-box max hidden', manager.pricesList);
        this.nameDiv = addElementTxt('div', '', this.div, `<h2>${this.imbuPrices.server}</h2>`);

        this.content = addElement('div', 'content', this.div);
        this.inputSide = addElement('div', 'input side', this.content);
        this.outputSide = addElement('div', 'output side', this.content);

        this.title1 = addElementTxt('b', '', this.inputSide, "Life Leech:");
        this.ls1Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Vampire Teeth: </span>");
        this.ls1Input = addElement('input', 'short-input', this.ls1Div);
        this.ls1Input.value = this.imbuPrices.lifesteal1;
        this.ls2Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Bloody Pincers: </span>");
        this.ls2Input = addElement('input', 'short-input', this.ls2Div);
        this.ls2Input.value = this.imbuPrices.lifesteal2;
        this.ls3Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Piece of Dead Brain: </span>");
        this.ls3Input = addElement('input', 'short-input', this.ls3Div);
        this.ls3Input.value = this.imbuPrices.lifesteal3;

        this.title2 = addElementTxt('b', '', this.inputSide, "Mana Leech:");
        this.ml1Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Rope Belt: </span>");
        this.ml1Input = addElement('input', 'short-input', this.ml1Div);
        this.ml1Input.value = this.imbuPrices.manaleech1;
        this.ml2Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Silencer Claw: </span>");
        this.ml2Input = addElement('input', 'short-input', this.ml2Div);
        this.ml2Input.value = this.imbuPrices.manaleech2;
        this.ml3Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Some Grimeleech Wings: </span>");
        this.ml3Input = addElement('input', 'short-input', this.ml3Div);
        this.ml3Input.value = this.imbuPrices.manaleech3;

        this.title1 = addElementTxt('b', '', this.inputSide, "Critical Hit:");
        this.ct1Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Protective Charm: </span>");
        this.ct1Input = addElement('input', 'short-input', this.ct1Div);
        this.ct1Input.value = this.imbuPrices.crit1;
        this.ct2Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Sabretooth: </span>");
        this.ct2Input = addElement('input', 'short-input', this.ct2Div);
        this.ct2Input.value = this.imbuPrices.crit2;
        this.ct3Div = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'>Vexclaw Talon: </span>");
        this.ct3Input = addElement('input', 'short-input', this.ct3Div);
        this.ct3Input.value = this.imbuPrices.crit3;

        this.tkDiv = addElementTxt('div', 'tiny-row', this.inputSide, "<span class='input-label'><b>Gold Token: </b></span>");
        this.tkInput = addElement('input', 'short-input', this.tkDiv);
        this.tkInput.value = this.imbuPrices.token;

        this.buttonsDiv = addElement('div', 'wrap-list only-top-margin', this.div);
        //this.buttonsDiv.setAttribute('style', "margin: 20px 0 0 0;");
        this.deleteButton = addElementTxt('button', 'delete', this.buttonsDiv, "Delete");
        this.calculateButton = addElementTxt('button', 'main', this.buttonsDiv, "Evaluate");
        this.saveButton = addElementTxt('button', '', this.buttonsDiv, "Save");

        this.calculateButton.addEventListener('click', () => { this.evaluatePrices(); });
        this.saveButton.addEventListener('click', () => { this.save(); });
        this.deleteButton.addEventListener('click', () => { this.delete(); });

        this.pricesTable = addElement('table', '', this.outputSide);
        this.pricesTableHead = addElementTxt('thead', '', this.pricesTable, "\
        <tr><td>Imbument</td><td>Total Price</td><td>Per Hour</td></tr>");
        this.pricesTableBody = addElement('tbody', '', this.pricesTable);

        this.divs = [this.ls1Div, this.ls2Div, this.ls3Div, this.ml1Div, this.ml2Div, this.ml3Div, this.ct1Div, this.ct2Div, this.ct3Div];
        this.inputs = [this.ls1Input, this.ls2Input, this.ls3Input, this.ml1Input, this.ml2Input, this.ml3Input, this.ct1Input, this.ct2Input, this.ct3Input];
        this.itemAmounts = [25, 15, 5, 25, 25, 5, 20, 25, 5];
        this.names = ['Basic Vampirism', 'Intricate Vampirism', 'Powerful Vampirism', 'Basic Void', 'Intricate Void', 'Powerful Void', 'Basic Strike', 'Intricate Strike', 'Powerful Strike'];
        this.products = ['item', 'item', 'item', 'item', 'item', 'item', 'item', 'item', 'item'];
        this.totalPrices = [100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000, 100000];
        this.costsPerHour = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];


        let bodyText = "";
        this.names.forEach((nm, ind) => {
            bodyText += `<tr><td>${ this.names[ind] }</td><td>${ this.totalPrices[ind] }</td><td>${ this.costsPerHour[ind] }</td></tr>`;
        });
        this.pricesTableBody.innerHTML = bodyText;

        this.evaluatePrices();

        this.legend = addElementTxt('div', 'legend only-top-margin', this.outputSide, "<p>*Crossed products are less cost efficient than gold tokens</p>");

        this.SelectThisButton = addElementTxt('button', ' mside20 toggled', this.manager.buttonsList, `${this.imbuPrices.server}`);
        this.SelectThisButton.addEventListener('click', () => { this.manager.selectPrices(this); })

    }

    evaluatePrices() {
        let tkn = this.tkInput.value;
        let wa = 'tiny-row waste';
        let pr = 'tiny-row profit';


        let bodytxt = "";
        for(let i = 0; i < 9; i++) {

            let tier = (i % 3) + 1;
            let itemCost = 0;
            let tokenCost = tkn * tier * 2;

            this.inputs[i].value = parseInt(this.inputs[i].value);

            let tokensCheaper = false;
            let imbuCost = this.inputs[i].value * this.itemAmounts[i];


            switch (tier) {
                case 1:
                    itemCost = this.inputs[i].value * this.itemAmounts[i];
                    
                break;
                case 2:
                    itemCost = (this.inputs[i].value * this.itemAmounts[i])
                        + (this.inputs[i-1].value * this.itemAmounts[i-1]);
                break;
                case 3:
                    itemCost = (this.inputs[i].value * this.itemAmounts[i])
                        + (this.inputs[i-1].value * this.itemAmounts[i-1])
                        + (this.inputs[i-2].value * this.itemAmounts[i-2]);
                break;
            }

            if (tokenCost < itemCost) {
                imbuCost = tkn * 2;
                tokensCheaper = true;
            }

            // let imbuCost = 0;
            // this.inputs[i].value = parseInt(this.inputs[i].value);
            // if (this.inputs[i].value < 1) { this.inputs[i].value = 0; }
            // if ((this.inputs[i].value * this.itemAmounts[i]) > (2 * tkn)) {
            //     imbuCost = tkn * 2;
            //     this.divs[i].setAttribute('class', wa);
            //     this.products[i] = "tokens";
            // } else {
            //     imbuCost = this.inputs[i].value * this.itemAmounts[i];
            //     this.divs[i].setAttribute('class', pr);
            //     this.products[i] = "items";
            // }


            if (tokensCheaper === true) {
                this.divs[i].setAttribute('class', wa);
                this.products[i] = "tokens";
            } else {
                this.divs[i].setAttribute('class', pr);
                this.products[i] = "items";
            }


            if (tier == 1) {
                imbuCost += 15000;
            } else if (tier == 2) {
                imbuCost += 40000 + this.totalPrices[i-1];
            } else if (tier == 3) {
                imbuCost += 95000 + this.totalPrices[i-1];
            }

            this.totalPrices[i] = imbuCost;
            this.costsPerHour[i] = Math.round(imbuCost/20);

            bodytxt += `<tr><td class='${ this.products[i] }'>${ this.names[i] }</td><td>${ this.totalPrices[i] }</td><td>${ this.costsPerHour[i] }</td></tr>`;
        }

        this.pricesTableBody.innerHTML = bodytxt;

    }

    save() {
        this.evaluatePrices();

        this.imbuPrices.lifesteal1 = this.inputs[0].value;
        this.imbuPrices.lifesteal2 = this.inputs[1].value;
        this.imbuPrices.lifesteal3 = this.inputs[2].value;
        this.imbuPrices.manaleech1 = this.inputs[3].value;
        this.imbuPrices.manaleech2 = this.inputs[4].value;
        this.imbuPrices.manaleech3 = this.inputs[5].value;
        this.imbuPrices.crit1 = this.inputs[6].value;
        this.imbuPrices.crit2 = this.inputs[7].value;
        this.imbuPrices.crit3 = this.inputs[8].value;
        this.imbuPrices.token = this.tkInput.value;

        this.manager.controller.updateImbuPrices(this.imbuPrices);

    }

    delete() {
        let ind = this.manager.imbuPrices.indexOf(this);
        this.manager.imbuPrices.splice(ind, 1);

        ind = this.manager.controller.imbuPrices.indexOf(this);
        this.manager.controller.imbuPrices.splice(ind, 1);

        if (this.manager.imbuPrices.length > 0) { this.manager.selectPrices(this.manager.imbuPrices[0]);  }

        let srv = this.imbuPrices.server;
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: "./php/userImbuPrices/deleteImbuPrices.php",
            data: {server: srv},
            success: (ret) => {
                if (ret.fb == "success") {
                    //
                }
            }
        })

        this.close();
    }

    close() {
        this.div.parentNode.removeChild(this.div);
        this.SelectThisButton.parentNode.removeChild(this.SelectThisButton);
        delete this;
    }
}

class ImbuPricesManager {
    constructor(controller) {
        controller.setOpenedWindow(this);
        this.controller = controller;
        // allows user to create new activities
        this.div = addElement('div', 'manager-window', site);
        this.title = addElementTxt('h3', 'page-title', this.div, "My Imbu Prices");
        this.buttonsList = addElement('div', 'wrap-list shadow-box max', this.div);
        this.pricesList = addElement('div', 'wrap-list', this.div);

        this.newImbuPricesDiv = addElement('div', 'input-box shadow-box', this.div);

        this.serverRow = addElementTxt('div', 'flex-div center', this.newImbuPricesDiv, "<p class='input-label'>Add server:</p>");
        this.serverSelector = addElement('select', 'mside20', this.serverRow);
        this.addServerButton = addElementTxt('button', '', this.serverRow, "Add");
        this.addServerButton.addEventListener('click', () => { this.addServer(); })
        this.feedbackDiv = addElement('div', 'wrap-list hidden', this.newImbuPricesDiv);

        this.controller.serverNames.forEach((serv) => {
            let opt = addElement('option', '', this.serverSelector);
            opt.textContent = serv;
            opt.value = serv;
        });

        this.loadImbuPrices();
    }

    loadImbuPrices() {
        this.imbuPrices = [];
        // imbu prices are used by other components so they are stored in controller object
        this.controller.imbuPrices.forEach((imbu) => { new ManagerImbuPrices(this, imbu); });
        if (this.imbuPrices.length > 0) { this.selectPrices(this.imbuPrices[0]); }
    }

    addServer() {
        let srv = this.serverSelector.value;

        this.controller.imbuPrices.forEach((im) => {
            if (im.server == srv) { srv = false; }
        })

        if (srv === false) {
            this.feedbackDiv.innerHTML = "You already have imbuing prices for this server";
            this.feedbackDiv.classList.remove('hidden');
        } else {
            let mg = this;
            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: "./php/userImbuPrices/addImbuPrices.php",
                data: {server: srv},
                success: (ret) => {
                    if (ret.fb == "success") {
                        new ManagerImbuPrices(mg, ret.imbuPrices);
                        mg.controller.imbuPrices.push(ret.imbuPrices);
                    }
                }
            })
        }
    }

    selectPrices(obj) {
        this.imbuPrices.forEach((ip) => {
            if (ip == obj) {
                //make selected
                ip.SelectThisButton.classList.remove('toggled');
                ip.div.classList.remove('hidden');
                ip.ls1Input.focus();

            } else {
                ip.SelectThisButton.classList.add('toggled');
                ip.div.classList.add('hidden');
            }
        });
    }

    close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openImbuPricesManager = (controller) => {
    return new ImbuPricesManager(controller);
}


export { openImbuPricesManager };