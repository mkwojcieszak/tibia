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

class SplitterPlayer {
    constructor(splitter, name, waste, loot) {
        this.splitter = splitter;
        this.div = addElement('div', 'flex-div', this.splitter.playerList);

        this.nameBox = addElementTxt('div', 'flex-div side-margin-10', this.div, "Name: ");
        this.inputBox = addElementTxt('div', 'flex-div side-margin-10', this.div, "Waste: ");
        this.outputBox = addElementTxt('div', 'flex-div side-margin-10', this.div, "Loot: ");
        this.deleteButton = addElementTxt('button', 'delete side-margin-10', this.div, "Remove");
        this.splitOutput = addElementTxt('div', 'flex-div', this.splitter.resultDiv, "");

        this.deleteButton.addEventListener('click', () => { this.splitter.removePlayer(this); })

        this.nameInput = addElement('input', 'medium-input', this.nameBox);
        this.wasteInput = addElement('input', 'short-input', this.inputBox);
        this.lootInput = addElement('input', 'short-input', this.outputBox);

        this.nameInput.value = name;
        this.wasteInput.value = waste;
        this.lootInput.value = loot;
    }

    close() {
        this.div.parentNode.removeChild(this.div);
        this.splitOutput.parentNode.removeChild(this.splitOutput);
		delete this;
	}
}

class LootSplitter {
    constructor(controller) {
        // User can add/remove party members (starts with 4) and click calculate :)
        controller.setOpenedWindow(this);
        this.controller = controller;
        
		this.div = addElement('div', 'manager-window', site);
        this.title = addElementTxt('h3', 'page-title', this.div, "Loot Splitter");
        this.inputSection = addElement('div', 'shadow-box max', this.div);
        this.playerList = addElement('div', 'wrap-list', this.inputSection);

        this.addButtonDiv = addElement('div', 'wrap-list', this.inputSection);
        this.addButton = addElementTxt('button', '', this.addButtonDiv, "Add Player");

        this.dataDiv = addElementTxt('div', 'wrap-list', this.inputSection, `\
            Party data (example: "knight 60000 300000 druid 80000 0 sorcerer 40000 0 paladin 11000 0")`);
        this.dataInput = addElement('input', 'long-input max', this.dataDiv);

        this.calcButtonDiv = addElement('div', 'wrap-list splitter', this.inputSection);
        this.calcButton = addElementTxt('button', 'main', this.calcButtonDiv, "Calculate");

        this.resultDiv = addElement('div', 'column-list shadow-box max', this.div);
        this.resultsTitle = addElementTxt('h3', '', this.resultDiv, "Results:");
        this.resultWasteDiv = addElementTxt('div', 'flex-div', this.resultDiv, "");
        this.resultProfitDiv = addElementTxt('div', 'flex-div', this.resultDiv, "");
        this.totalResultDiv = addElementTxt('div', 'flex-div margin-bot', this.resultDiv, "");

        this.players = [];

        this.addPlayer("Knight", 0, 0);
        this.addPlayer("Druid", 0, 0);
        this.addPlayer("Sorcerer", 0, 0);
        this.addPlayer("Paladin", 0, 0);

        this.addButton.addEventListener('click', () => { this.addPlayer('Name', 0, 0); })
        this.calcButton.addEventListener('click', () => { this.calculate(); })

        this.dataInput.focus();
        this.dataInput.addEventListener('keydown', (e) => {
            if (e.keyCode == 13) { this.loadData(); }
            else if (e.keycode == 86 && e.ctrlKey == true) { this.loadData(); }
        });

        this.infoDiv  = addElementTxt('div', 'column-list shadow-box max', this.div, "*How calculation works:<br>1. All loot is combined first.<br>2. Every player receives a payback for his waste.<br>3. Every player gets an equal share of total profit or waste.");

    }

    addPlayer(name, waste, loot) {
        this.players.push(new SplitterPlayer(this, name, waste, loot));
    }

    removePlayer(player) {
        let ind = this.players.indexOf(player);
        this.players.splice(ind, 1);
        player.close();
    }

    calculate() {
        let totalInput = 0;
        let totalOutput = 0;

        this.players.forEach((pla) => {
            pla.wasval = parseInt(pla.wasteInput.value);
            pla.lootval = parseInt(pla.lootInput.value);

            totalInput += pla.wasval;
            totalOutput += pla.lootval;
        });

        let totalResult = parseInt(totalOutput - totalInput);
        let playerResult = Math.round(totalResult / this.players.length);

        this.resultWasteDiv.innerHTML = `Total waste: <b> ${totalInput} </b> gold.`;
        this.resultProfitDiv.innerHTML = `Total loot: <b> ${totalOutput} </b> gold.`;
        this.totalResultDiv.innerHTML = `Final result: <b> ${totalResult} </b> gold (<b> ${playerResult} </b> gold per player).`;
        let spr = 0;
        this.players.forEach((pla) => {
            spr = pla.wasval + playerResult;
            //pla.splitOutput.innerHTML = pla.nameInput.value + " gets " + spr + " gold.";
            pla.splitOutput.innerHTML = `<b> ${pla.nameInput.value} </b> gets <b> ${spr} </b> gold.`;
        })

    }

    clear() {
        this.players.forEach((pl) => { pl.close(); });
        this.players = [];
    }

    loadData() {
        let data = this.dataInput.value;
        let arr = data.split(" "); //l = 12
        let amount = Math.round(arr.length/3); //4?

        this.clear();

        for(let i = 0; i < amount; i++) {
            this.addPlayer(arr[i*3], arr[i*3 + 1], arr[i*3 + 2]);
        }

        this.calculate();

    }

    close() {
		this.div.parentNode.removeChild(this.div);
		delete this;
	}
}

const openLootSplitter = (controller) => {
    return new LootSplitter(controller);
}


export { openLootSplitter };