using System;
using System.Linq;
using System.Net;
using NLog;

namespace ServerMonitor.Web.BackEnd
{
    public class HttpServer
    {
        private readonly HttpListener _httpListener = new HttpListener();

        public HttpServer(ushort port = 5000)
        {
            _httpListener.Prefixes.Add($"http://*:{port}/");
        }

        private static Logger Log => ServerMonitorPlugin.Log;

        public void Start()
        {
            _httpListener.Start();
            Loop();
        }

        public void Stop()
        {
            _httpListener.Stop();
        }

        private async void Loop()
        {
            while (_httpListener.IsListening)
            {
                try
                {
                    var context = await _httpListener.GetContextAsync();
                    if (RequestHandlerHolder.RequestHandlers.Any(it => it.TryHandle(context)))
                    {
                        continue;
                    }

                    //can't handle this request
                    var response = context.Response;
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Close();
                }
                catch (HttpListenerException)
                {
                }
                catch (Exception e)
                {
                    Log.Error(e);
                }
            }
        }
    }
}