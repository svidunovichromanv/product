import {EventEmitter} from "../helpers.js";

export class KeypadView extends EventEmitter{
    constructor(){
        super();
        this.keypad = document.getElementById('calculator');
        this.keypad.addEventListener('click', this.handleClick.bind(this));
        this.buttonKeypad = document.querySelector('#btn-calculator');
        this.buttonKeypad.addEventListener('click',this.handleShowKeypad.bind(this));
        this.iconToggle = this.buttonKeypad.querySelector('.toggle');
    }
    handleShowKeypad(){
        this.emit('showKeypad');
    }

    handleClick(event){
        if(event.target && event.target.hasAttribute('data-key-value') || event.target.parentNode.hasAttribute('data-key-value')){
            const keyValue = event.target.getAttribute('data-key-value') || event.target.parentNode.getAttribute('data-key-value');
            this.emit('click', keyValue );
        }
    }
    showKeypad(){
        this.keypad.classList.toggle('calculator-visible');
        this.buttonKeypad.classList.toggle('close');
        let self = this;
        setTimeout(function () {
            self.iconToggle.classList.toggle('fa-sort-down');
            self.iconToggle.classList.toggle('fa-sort-up');
            self.buttonKeypad.classList.toggle('open');
        },0)
    }
}
