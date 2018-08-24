import { EventEmitter } from '../helpers.js';
import { Validator } from './validator.js';



 export class Formula extends EventEmitter{
    constructor(validator) {
        super();
        this.data = [{'line-input':[]}];
        this.maxlength = 16;
        this.stateData = false;
        if (validator instanceof Validator) {
            this.validator = validator;
        }
    }
    getData(){
        return this.data;
    }

     getItem(id) {
         for (let i = 0; i < this.data.length; i++) {
             for (let k in this.data[i]) {
                 if (k === id) {
                     return this.data[i][k];
                 }
             }
         }
     }

     setData(data) {
         this.emit('setData', data);
         this.emit('change', this.data);
     }
     saveData(id, data){
         let item = this.getItem(id);
         if(item) {
             for (let i = 0; i < this.data.length; i++) {
                 for (let k in this.data[i]) {
                     if (k === id) {
                         this.data[i][k] = data;
                     }
                 }
             }
         }
         else{
             let newItem = {[id]: data};
             this.data.push(newItem);
         }
     }
     clearData(){
         this.data = [{'line-input':[]}];
     }


    validateData(data) {
        this.validator.validate(data);
        this.stateData = this.validator.validItem;
    }

    addDataInItem(id,index, data) {
        const item = this.getItem(id);
        if(item.length >= this.maxlength)return false;
        this.validateData(data);   //проверяем введенные данные и если они true добавляем в массив
        if(this.stateData){
            if(index === item.length){
                item.push(data);
                this.emit('change', this.data);
            }
            else{
                console.log(index);
                let newArray = [];
                for(let i=0;i<index;i++){
                    newArray.push(item[i]);
                }
                newArray.push(data);
                for(let i = index;i< item.length;i++){
                    newArray.push(item[i]);
                }
                this.changeData(id, newArray);
            }
            return true;
        }
        else return false;
    }
     changeData(id, newArray) {
         for (let i = 0; i < this.data.length; i++) {
             for (let k in this.data[i]) {
                 if (k === id) {
                     this.data.splice(i, 1);
                     let newData = {};
                     newData[id] = newArray;
                     this.data.push(newData);
                     console.log(this.data);
                     this.emit('change', this.data);
                 }
             }
         }
     }


    deleteDataFromItem(obj) {
        const id = Object.keys(obj)[0];
        const index = obj[id];
        const item = this.getItem(id);

        if(item.length > 0){
            //let nodeIndex = parseInt(node.getAttribute('data-index'));
            item.splice(index,1);
            this.emit('change', this.data);
        }

    }

    addItem(data){
        this.data.push(data);
    }


    deleteItem(id) {
        for(let i = 0;i < this.data.length;i++){
            for(let k in this.data[i]){
                if(k === id){
                    this.data.splice(i, 1);
                    this.emit('change', this.data);
                    break;
                }
            }
        }
    }
     cleanItem(id){
         const item = this.getItem(id);
         item.splice(0, item.length);

         this.emit('change', this.data);

     }
}












