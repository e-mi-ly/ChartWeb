using Microsoft.AspNetCore.SignalR;
using Moq;
using RealTimeCharts_Server.HubConfig;
using RealTimeCharts_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RealTimeCharts_Server.UnitTests
{
    public class ChartHubTests
    {
        [Fact]
        public async Task ChartHub_ShouldBroadcastCorrectChartDataWithoutModifying()
        {
            Mock<IHubCallerClients> mockClients = new Mock<IHubCallerClients>();
            // Arrange
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);
            ChartHub chartHub = new ChartHub()
            {
                Clients = mockClients.Object
            };
            List<ChartModel> testData = new List<ChartModel>()
            {
                new ChartModel()
                {
                    Data = new List<int>() { 1, 5, 7 },
                    Label = "Chart Model 01"
                },
                new ChartModel()
                {
                    Data = new List<int>() { 100, 500, 700 },
                    Label = "Chart Model 02"
                }
            };

            // Act
            await chartHub.BroadcastChartData(testData);

            // Assert
            mockClients.Verify(clients => clients.All, Times.Once);

            var a = testData.Cast<object>().ToArray();
            mockClientProxy.Verify(
                clientProxy => clientProxy.SendCoreAsync(
                    "broadcastchartdata",
                     It.Is<object[]>(o => o != null && 
                        o.Length == 1 && 
                        ((List<ChartModel>)o[0]) == testData),
                    default(CancellationToken)),
                Times.Once);
        }
    }
}
