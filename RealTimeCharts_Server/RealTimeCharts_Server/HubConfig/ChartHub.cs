using Microsoft.AspNetCore.SignalR;
using RealTimeCharts_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeCharts_Server.HubConfig
{
    public class ChartHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("onConnection", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public async Task BroadcastChartData(List<ChartModel> data) => await Clients.All.SendAsync("broadcastchartdata", data);

        public async Task BroadcastPrediction(PredictionModel prediction) => await Clients.All.SendAsync("broadcastPrediction", prediction);
    }
}
