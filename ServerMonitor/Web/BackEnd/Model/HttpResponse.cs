using System;
using System.Net;

namespace ServerMonitor.Web.BackEnd.Model
{
    // ReSharper disable MemberCanBePrivate.Global
    public class HttpResponse
    {
        public readonly HttpStatusCode code;
        public readonly string message;

        public HttpResponse(HttpStatusCode code, string message)
        {
            this.code = code;
            this.message = message;
        }

        public HttpResponse(HttpStatusCode code, Exception exception) : this(code, exception.Message)
        {
        }
    }
}