using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTimeCharts_Server.Models
{
    public class PredictionModel
    {
        public string connectionId { get; set; }
        public string data { get; set; }
        public string prediction { get; set; }

    }
}
