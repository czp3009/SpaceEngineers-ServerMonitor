using System.Net;

namespace ServerMonitor.Web.BackEnd
{
    public class StaticResourceRequestHandler : IRequestHandler
    {
        public bool TryHandle(HttpListenerContext context)
        {
            return false;
        }
    }
}