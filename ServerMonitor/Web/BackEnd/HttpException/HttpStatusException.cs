using System;
using System.Net;

namespace ServerMonitor.Web.BackEnd.HttpException
{
    // ReSharper disable MemberCanBePrivate.Global
    public class HttpStatusException : Exception
    {
        public readonly HttpStatusCode Code;

        public HttpStatusException(HttpStatusCode code, string message) : base(message)
        {
            Code = code;
        }

        public HttpStatusException(HttpStatusCode code, Exception exception)
            : base(exception.Message, exception.InnerException)
        {
            Code = code;
        }
    }
}