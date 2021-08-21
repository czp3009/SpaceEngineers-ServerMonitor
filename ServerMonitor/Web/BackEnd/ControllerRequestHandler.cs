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
        private readonly ControllerHolder _controllerHolder = new ControllerHolder();
        private static Logger Log => ServerMonitorPlugin.Log;

        public bool TryHandle(HttpListenerContext context)
        {
            var request = context.Request;
            if (!_controllerHolder.ControllerMethods.TryGetValue((request.HttpMethod, request.Url.AbsolutePath),
                out var handler))
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

                HttpListenerResponse response = null;
                try
                {
                    response = context.Response;

#if DEBUG
                    //cors for local debug
                    if (request.Url.Host == "localhost")
                    {
                        var uri = request.UrlReferrer;
                        if (uri != null)
                        {
                            response.Headers["Access-Control-Allow-Origin"] = $"{uri.Scheme}://{uri.Authority}";
                        }
                    }
#endif
                    //generate exception response body
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

                    //write result to response stream
                    if (result == null) return;
                    response.ContentType = "application/json";
                    var json = JsonConvert.SerializeObject(result);
                    var buffer = System.Text.Encoding.UTF8.GetBytes(json);
                    response.ContentLength64 = buffer.Length;
                    var outputStream = response.OutputStream;
                    await outputStream.WriteAsync(buffer, 0, buffer.Length);
                    outputStream.Close();
                }
                catch (HttpListenerException)
                {
                }
                catch (Exception e)
                {
                    Log.Error(e);
                }
                finally
                {
                    response?.Close();
                }
            }

            Handle();

            return true;
        }
    }
}