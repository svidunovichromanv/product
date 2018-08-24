
export function find(array, value) {
    let result = false;
    array.forEach(function (item) {
        if(item.id){
            for(let i = 0;i< value.length;i++){
                if(item.id === value[i])result = true;
            }
        }
    });
    return result;
}

export class EventEmitter{
    constructor(){
        this.events = {};

    }
    on(type, callback){
        this.events[type] = this.events[type] || [];
        this.events[type].push(callback);
    }
    emit(type, arg){
        if(this.events[type]){
            this.events[type].forEach((callback => callback(arg)));
        }
    }
}

