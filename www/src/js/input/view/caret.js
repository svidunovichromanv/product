export class Caret{
    constructor() {
        let self = this;
        this.value = document.createElement('strong');
        this.value.innerHTML ='&#8203';
        function flash() {
            self.value.classList.toggle('blink');
            if (self.timer) {
                clearTimeout(self.timer);
            }
            self.timer = setTimeout(flash, 500);
        }

        this.timer = setTimeout(flash, 500);
    }
}