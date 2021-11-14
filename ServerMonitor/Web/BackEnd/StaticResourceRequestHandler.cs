using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using NLog;

namespace ServerMonitor.Web.BackEnd
{
    public class StaticResourceRequestHandler : IRequestHandler
    {
        private static readonly Dictionary<string, string> MimeTable = new Dictionary<string, string>
        {
            { "html", "text/html" },
            { "js", "application/x-javascript" },
            { "map", "application/json" },
            { "png", "image/png" }
        };

        private readonly Assembly _assembly = Assembly.GetExecutingAssembly();
        private static Logger Log => ServerMonitorPlugin.Log;

        public bool TryHandle(HttpListenerContext context)
        {
            var request = context.Request;
            if (request.HttpMethod != "GET") return false;
            var uri = request.Url;
            var path = uri.AbsolutePath;
            //fallback all request to index.html for SPA
            var stream = GetResourceFileStream(path) ?? GetResourceFileStream("/index.html");
            if (stream == null) return false;

            async void Handle()
            {
                HttpListenerResponse response = null;
                Stream outputStream = null;
                try
                {
                    response = context.Response;
                    var contentType = TryGetContentType(uri.Segments.Last());
                    if (contentType != null) response.ContentType = contentType;
                    response.ContentLength64 = stream.Length;
                    outputStream = response.OutputStream;
                    await stream.CopyToAsync(outputStream);
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
                    stream.Close();
                    outputStream?.Close();
                    response?.Close();
                }
            }

            Handle();

            return true;
        }

        private Stream GetResourceFileStream(string path)
        {
            try
            {
                var name = $"ServerMonitor.Web.FrontEnd.dist{path.Replace('/', '.')}";
                return _assembly.GetManifestResourceStream(name);
            }
            catch (Exception)
            {
                // ignored
            }

            return null;
        }

        private static string TryGetContentType(string fileName)
        {
            var indexOfLastDot = fileName.LastIndexOf('.');
            if (indexOfLastDot < 0 || indexOfLastDot == fileName.Length - 1) return null;
            var extension = fileName.Substring(indexOfLastDot + 1);
            MimeTable.TryGetValue(extension, out var contentType);
            return contentType;
        }
    }
}