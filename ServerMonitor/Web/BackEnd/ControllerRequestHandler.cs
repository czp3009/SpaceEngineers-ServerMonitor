using System;
using System.Net;
using Newtonsoft.Json;
using NLog;
using ServerMonitor.Web.BackEnd.HttpException;
using ServerMonitor.Web.BackEnd.Model;

namespace ServerMonitor.Web.BackEnd
{
    public class ControllerRequestHandler : IRequestHandler
    {
        private static Logger Log => ServerMonitorPlugin.Log;

        public bool TryHandle(HttpListenerContext context)
        {
            var request = context.Request;
            if (!ControllerHolder.Controllers.TryGetValue(request.Url.AbsolutePath, out var handler))
            {
                return false;
            }

            async void Handle()
            {
                object result = null;
                Exception exception = null;
                try
                {
                    result = await handler(request);
                }
                catch (HttpListenerException)
                {
                    return;
                }
                catch (HttpStatusException e)
                {
                    exception = e;
                }
                catch (Exception e)
                {
                    exception = e;
                    Log.Error(e);
                }

                var response = context.Response;
                if (exception != null)
                {
                    HttpStatusCode statesCode;
                    if (exception is HttpStatusException statusException)
                    {
                        statesCode = statusException.Code;
                    }
                    else
                    {
                        statesCode = HttpStatusCode.InternalServerError;
                    }

                    response.StatusCode = (int)statesCode;
                    result = new HttpResponse(statesCode, exception);
                }

                if (result != null)
                {
                    response.ContentType = "application/json";
                    var json = JsonConvert.SerializeObject(result);
                    var buffer = System.Text.Encoding.UTF8.GetBytes(json);
                    response.ContentLength64 = buffer.Length;
                    var outputStream = response.OutputStream;
                    await outputStream.WriteAsync(buffer, 0, buffer.Length);
                    outputStream.Close();
                }

                response.Close();
            }

            Handle();
            return true;
        }
    }
}