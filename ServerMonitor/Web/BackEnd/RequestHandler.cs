using System.Net;

namespace ServerMonitor.Web.BackEnd
{
    public interface IRequestHandler
    {
        bool TryHandle(HttpListenerContext context);
    }
}