using System.Collections.Generic;

namespace ServerMonitor.Web.BackEnd
{
    public class RequestHandlerHolder
    {
        public readonly List<IRequestHandler> RequestHandlers = new List<IRequestHandler>();

        public RequestHandlerHolder()
        {
            RequestHandlers.Add(new ControllerRequestHandler());
            RequestHandlers.Add(new StaticResourceRequestHandler());
        }
    }
}