export class ViewPlot{
    constructor(model){
        this.model = model;
        this.host = document.getElementById('plot');
        this.onCheckedCallback = null;
        this.layout=null;
    }
    plot(self){
        if(!self){
            self =this;
        }
        self.layout = {
            autosize: true,
            width: self.host.getBoundingClientRect().width,
            height: self.host.getBoundingClientRect().height,
            margin: {
                l: 30,
                r: 20,
                b: 60,
                t: 20,
                pad: 4
            },
            xaxis: {
                title: 'Ось Ох',
                titlefont: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
            },
            yaxis: {
                title: 'Ось Оу',
                titlefont: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f',
                    transform: "rotate(55deg)"
                }
            },
            showlegend:false
        };

        Plotly.newPlot(self.host, self.model.data, self.layout);
        self.host.on('plotly_relayout', e => self.onChecked(e['xaxis.range[0]'], e['xaxis.range[1]']));
    }
    onChecked(firstX,lastX) {
        if (typeof (this.onCheckedCallback) === 'function') {
            this.onCheckedCallback(firstX, lastX);
        }
    }
}