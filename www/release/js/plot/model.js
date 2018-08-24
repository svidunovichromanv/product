

export class ModelPlot{
    constructor() {
        this.xValues = null;
        this.expr = null;
        this.yValuesAll = null;
        this.yValues = null;
        this.expression = null;
        this.xValuesAll = null;
        this.trace1 = null;
        this.data = null;
        this.changeCallback = null;
        this.temp=2;
    }
    recalculate(firstX,lastX,expression){
        if (!expression){
            expression=this.expression;
        }else{
            this.expression=expression;
        }
        this.data = [];
        let str;
        for (let i = 0; i<this.expression.length; i++) {
            for (let key in this.expression[i]) {
                try {
                    str = this.expression[i][key].join("");

                    let arr = str.split("");
                    for (let j = 0; j <= arr.length; j++){
                        if (arr[j] === "|"){
                            if(this.temp%2===0){
                                arr[j]="sqrt((";
                                this.temp++;
                            }else{
                                arr[j]=")^2)";
                                this.temp++;
                            }
                        }
                    }
                    if (arr.join("")==="y=0.5*x^2-3*х"){
                        arr="y=0.5*x^2-3*x".split("");
                    }
                    this.expr = math.compile(arr.join(""));

                    if (this.expression[i][key][0] === "x" && this.expression[i][key][1] === "=") {
                        this.yValues = math.range(firstX, lastX, 0.1).toArray();
                        this.xValuesAll = this.yValues.map((y) => {
                            return this.expr.eval({y: y})
                        });
                        this.xValues = this.xValuesAll.map((x) => {
                            return x >= firstX && x <= lastX ? x : false
                        });

                    } else {
                        this.xValues = math.range(firstX, lastX, 0.1).toArray();
                        this.yValuesAll = this.xValues.map((x) => {
                            return this.expr.eval({x: x})
                        });
                        this.yValues = this.yValuesAll.map((y) => {
                            return y >= firstX && y <= lastX ? y : false
                        });
                    }
                    this.trace1 = {
                        x: this.xValues,
                        y: this.yValues,
                        type: 'scatter'
                    };
                    this.data.push(this.trace1);
                }
                catch (e) {
                    console.log(`err`);
                }
            }
        }
        if (typeof (this.changeCallback) === 'function'){
            this.changeCallback();
        }
    };
}