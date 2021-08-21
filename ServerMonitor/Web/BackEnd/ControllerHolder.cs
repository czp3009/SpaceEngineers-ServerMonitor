using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ServerMonitor.Web.BackEnd.Controller;

namespace ServerMonitor.Web.BackEnd
{
    public class ControllerHolder
    {
        public readonly Dictionary<(string, string), Func<HttpListenerRequest, Task<object>>> ControllerMethods =
            new Dictionary<(string, string), Func<HttpListenerRequest, Task<object>>>();

        public ControllerHolder()
        {
            var basicInfoController = new BasicInfoController();
            ControllerMethods[("GET", "/api/basicInfo")] = basicInfoController.GetBasicInfo;
        }
    }
}