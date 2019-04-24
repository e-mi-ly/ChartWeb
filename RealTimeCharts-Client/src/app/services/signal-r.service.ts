import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ChartModel, PredictionModel } from '../_interfaces/chartmodel.model';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    public data: ChartModel[];
    public broadcasted: ChartModel[];
    public predictions: PredictionModel[] = new Array<PredictionModel>();

    private hubConnection: signalR.HubConnection;
    private connectionId: string;
    get ConnectionId() {
        return this.connectionId;
    }

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:5001/chart')
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public disConnection = () => {
        this.hubConnection
            .stop()
            .then(() => console.log('Disconnected!'))
            .catch(err => console.log('Error while disconnected: ' + err));
    }

    // invoke
    public broadcastChartData = () => {
        this.hubConnection.invoke('broadcastchartdata', this.data)
            .catch(err => console.error(err));
    }

    public broadcastPrediction = (data, prediction) => {
        const connectionId = this.connectionId;
        this.hubConnection.invoke('broadcastPrediction', {connectionId, data, prediction})
            .catch(err => console.error(err));
    }


    // listener
    public addOnConnectionListener = () => {
        this.hubConnection.on('onConnection', (connectionId) => {
            console.log('Connection id: ' + connectionId);
            this.connectionId = connectionId;
        });
    }

    public addTransferChartDataListener = () => {
        this.hubConnection.on('transferchartdata', (data) => {
            this.data = data;
        });
    }

    public addBroadcastChartDataListener = () => {
        this.hubConnection.on('broadcastchartdata', (data) => {
            this.broadcasted = data;
        });
    }

    public addBroadcastPredictionListener = () => {
        this.hubConnection.on('broadcastPrediction', (data) => {
            this.predictions.push(data);
        });
    }
}
