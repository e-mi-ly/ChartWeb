import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public chartOptions: any = {
        scaleShowVerticalLines: true,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    public chartLabels: string[] = ['Real time data for the chart'];
    public chartType = 'bar';
    public chartLegend = true;
    public colors: any[] = [
        { backgroundColor: '#5491DA' },
        { backgroundColor: '#E74C3C' },
        { backgroundColor: '#82E0AA' },
        { backgroundColor: '#E5E7E9' }
    ];

    private options = ['Data1', 'Data2', 'Data3', 'Data4'];
    private predicts = ['Increase', 'Decrease'];

    public dataSelected: FormControl = new FormControl();
    public predictSelected: FormControl = new FormControl();

    constructor(public signalRService: SignalRService, private http: HttpClient) {}

    ngOnInit() {
        this.signalRService.startConnection();
        this.signalRService.addOnConnectionListener();
        this.signalRService.addTransferChartDataListener();
        this.signalRService.addBroadcastChartDataListener();
        this.signalRService.addBroadcastPredictionListener();
        this.startHttpRequest();
    }

    ngOnDestroy() {
        this.signalRService.disConnection();
    }

    private startHttpRequest = () => {
        this.http.get('https://localhost:5001/api/chart')
            .subscribe(res => {
                console.log(res);
            });
    }

    public chartClicked = (event) => {
        console.log(event);
        this.signalRService.broadcastChartData();
    }

    public sendPredict = () => {
        if (this.dataSelected.value !== null && this.predictSelected.value !== null) {
            this.signalRService.broadcastPrediction(this.dataSelected.value, this.predictSelected.value);
        }
    }
}
