using System.Collections.Generic;

namespace ServerMonitor.Web.BackEnd
{
    public static class RequestHandlerHolder
    {
        public static readonly List<IRequestHandler> RequestHandlers = new List<IRequestHandler>
        {
            new ControllerRequestHandler(),
            new StaticResourceRequestHandler()
        };
    }
}