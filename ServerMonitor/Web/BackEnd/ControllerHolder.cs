using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using ServerMonitor.Web.BackEnd.Controller;

namespace ServerMonitor.Web.BackEnd
{
    public static class ControllerHolder
    {
        public static readonly Dictionary<string, Func<HttpListenerRequest, Task<object>>> Controllers =
            new Dictionary<string, Func<HttpListenerRequest, Task<object>>>
            {
                { "/basicInfo", BasicInfoController.GetBasicInfo }
            };
    }
}