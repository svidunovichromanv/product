import {EventEmitter, find} from "../helpers.js";
import { Caret } from "./caret.js";

export class FormulaViewInput extends EventEmitter {
    constructor() {
        super();
        this.caret = new Caret();
        this.input = document.getElementById('line-input');
        this.form = document.getElementById('input-form');
        this.btnCleanInput = this.input.querySelector('.btn-delete-input');
        this.btnAddNewInput = document.getElementById('btn-add-item');
        this.inputField = this.input.querySelector('.inputField');
        this.btnAddNewInput.addEventListener('click', this.handleAddNewInput.bind(this));
        document.addEventListener('click', this.handleEditingField.bind(this));
        document.addEventListener('keypress', this.handleAddItem.bind(this));
        document.addEventListener('keydown', this.handlePressKeypad.bind(this));
        this.btnCleanInput.addEventListener('click', this.handleCleanInput.bind(this));
        this.inputField.appendChild(this.caret.value);
    }

    handleEditingField(event) {
        this.emit('edit', event);
    }

    handleCleanInput() {
        this.emit('clean', this.input.id);
    }

    getNextIndexItem() {
        let activeField = document.querySelector('.activeField');
        if (activeField) {
            let inputField = activeField.querySelector('.inputField');
            let indexElem = inputField.childNodes.length - 1;
            if (this.caret.value.nextElementSibling) {
                indexElem = this.caret.value.nextElementSibling.getAttribute('data-index');
            }
            return indexElem;
        }
    }

    recalculateIndicesItems() {
        let activeField = document.querySelector('.activeField');
        let inputField = activeField.querySelector('.inputField');
        let items = inputField.getElementsByTagName('span');
        for (let i = 0; i < items.length; i++) {
            items[i].setAttribute('data-index', '' + i);
        }
    }

    editField(event) {
        let activeField = document.querySelector('.activeField');
        let newActiveField = event.target.parentNode;
        let hiddenField = document.querySelector('input');
        hiddenField.focus();
        if (newActiveField.classList.contains('line-input')) {

            let inputField = newActiveField.querySelector('.inputField');

            if (activeField) {
                activeField.classList.remove('activeField');  //снимаем активность с предыдущего поля и убираем каретку
                activeField.querySelector('.inputField').removeChild((this.caret.value));
            }
            newActiveField.classList.add('activeField'); //добавляем активность новому полю и каретку
            inputField.appendChild(this.caret.value);
        }
        else if (activeField && !find(event.path, ['input-form', 'calculator', 'btn-calculator'])) {
            hiddenField.blur();
            activeField.classList.remove('activeField');
            activeField.querySelector('.inputField').removeChild((this.caret.value));
        }

    }

    handleDeleteInput(event) {
        let id = event.currentTarget.parentNode.id;
        this.emit('delete', id);
    }


    handleAddItem(event) {
        let activeField = document.querySelector('.activeField');
        if (event && activeField) {
            let data = event.key;
            this.emit('keypress', data);
        }
    }

    handleAddNewInput() {
        this.emit('click');
    }

    handlePressKeypad(event) {
        let activeField = document.querySelector('.activeField');
        let keyCode = event.which;
        if (activeField) {
            if (keyCode == 37) {
                this.emit('keydownArrow', 'left');
            }
            if (keyCode == 39) {
                this.emit('keydownArrow', 'right');
            }
            if (keyCode == 8) {
                event.preventDefault();
                event.stopPropagation();
                if (this.caret.value.previousElementSibling) { //проверяем есть ли что удалять
                    let id = this.form.querySelector('.activeField').id;
                    let deletedNode = this.caret.value.previousElementSibling;
                    let index = deletedNode.getAttribute('data-index');
                    this.emit('keydownBackspace', {[id]: index});
                }
            }
            else return false;
        }
    }

    cleanInput() {
        this.inputField.innerHTML = '';
        this.inputField.appendChild(this.caret.value);
    }

    addNewInput(idInput) {
        let newNode = this.input.cloneNode(true);
        let btn = this.btnAddNewInput;

        newNode.id = idInput;
        this.input.parentNode.insertBefore(newNode, btn);
        let btnDeleteInput = newNode.querySelector('.btn-delete-input');
        btnDeleteInput.addEventListener('click', this.handleDeleteInput.bind(this));

        let activeField = document.querySelector('.activeField');
        let inputField = newNode.querySelector('.inputField');
        if (activeField) {
            activeField.classList.remove('activeField');   //снимаем активность с предыдущего поля и убираем каретку
            activeField.querySelector('.inputField').removeChild((this.caret.value));
        }
        newNode.classList.add('activeField'); //добавляем активность новому полю и каретку
        inputField.innerHTML = '';
        inputField.appendChild(this.caret.value);
        this.enumerateFields()
    }

    deleteInput(id) {
        let node = document.getElementById(id);
        node.parentNode.removeChild(node);
        let btnDeleteInput = node.querySelector('.btn-delete-input');
        btnDeleteInput.removeEventListener('click', this.handleDeleteInput.bind(this));
        this.enumerateFields()
    }

    addDataInItem(id, index, data) {
        const activeField = document.getElementById(id);
        const inputField = activeField.querySelector('.inputField');
        const caret = inputField.querySelector('strong');
        const node = this.createWrapperForData(index, data);
        if (node) {
            inputField.insertBefore(node, caret);
        }
        this.recalculateIndicesItems();

    }

    deleteDataFromItem() {
        const activeField = document.querySelector('.activeField');
        const input = activeField.querySelector('.inputField');
        const deletedNode = this.caret.value.previousElementSibling;
        input.removeChild(deletedNode);
        this.recalculateIndicesItems();
    }

    enumerateFields() {
        let fields = this.form.getElementsByClassName('data-number-input');
        let counter = 1;
        for (let i = 0; i < fields.length; i++) {
            fields[i].textContent = '' + counter;
            counter++
        }
    }


    moveCaret(direction) {
        const activeField = document.querySelector('.activeField');
        const input = activeField.querySelector('.inputField');
        if (direction === 'left') {
            const siblingPrev = this.caret.value.previousElementSibling;
            if (siblingPrev) {
                input.removeChild(this.caret.value);
                input.insertBefore(this.caret.value, siblingPrev);
            }
        }
        else {
            const siblingNext = this.caret.value.nextElementSibling;
            if (siblingNext) {
                input.removeChild(siblingNext);
                input.insertBefore(siblingNext, this.caret.value);
            }
        }
    }

    createWrapperForData(indexItem, data) {
        const letters = /[a-z]/;
        const minus = /\-/;
        const signMultiply = /\*/;
        const signPower = /\^\d/;
        const sign = /[\+\-\=]/;
        const signDivision = /\//;
        let node = null;

        if (signPower.test(data)) {
            node = document.createElement('span');
            let childNode = document.createElement('sup');
            data = data.replace('^', '');
            childNode.textContent = data;
            node.appendChild(childNode);
        }
        else if (letters.test(data)) {
            node = document.createElement('span');
            let childNode = document.createElement('var');
            childNode.textContent = data;
            node.appendChild(childNode);
        }
        else if (signMultiply.test(data)) {
            node = document.createElement('span');
            node.textContent = ' × ';

        }
        else if (minus.test(data)) {
            node = document.createElement('span');
            node.textContent = ' − ';

        }
        else if (signDivision.test(data)) {
            node = document.createElement('span');
            node.textContent = ' ÷ ';

        }
        else if (sign.test(data)) {
            node = document.createElement('span');
            node.textContent = ' ' + data + ' ';

        }
        else if (signPower.test(data)) {
            node = document.createElement('span');
        }
        else {
            node = document.createElement('span');
            node.textContent = data;
        }

        if (node) {
            node.setAttribute('data-index', indexItem);
        }
        return node;
    }

    showData(id, data) {
        let node = document.getElementById(id);
        if(!node){
            this.addNewInput(id);
            for(let i=0;i<data.length;i++){
                this.addDataInItem(id, i, data[i]);
            }
        }
        else{
            for(let i=0;i<data.length;i++){
                this.addDataInItem(id, i, data[i]);
            }
        }
    }

    clearData(){
        let nodes = this.form.querySelectorAll('.line-input');
        for(let i=0;i<nodes.length;i++){
            if(nodes[i].id !== 'line-input'){
                this.form.removeChild(nodes[i]);
            }
            else{
                this.cleanInput();
                nodes[i].classList.add('activeField');
            }
        }

    }
}
