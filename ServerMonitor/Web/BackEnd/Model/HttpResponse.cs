using System;
using System.Net;
using Newtonsoft.Json;

namespace ServerMonitor.Web.BackEnd.Model
{
    // ReSharper disable MemberCanBePrivate.Global
    public class HttpResponse
    {
        [JsonProperty("code")] public readonly HttpStatusCode Code;

        [JsonProperty("message")] public readonly string Message;

        public HttpResponse(HttpStatusCode code, string message)
        {
            Code = code;
            Message = message;
        }

        public HttpResponse(HttpStatusCode code, Exception exception) : this(code, exception.Message)
        {
        }
    }
}