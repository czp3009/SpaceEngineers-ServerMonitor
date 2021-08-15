using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Sandbox.Game.World;
using ServerMonitor.Web.BackEnd.Model;

namespace ServerMonitor.Web.BackEnd.Controller
{
    public static class BasicInfoController
    {
        public static async Task<object> GetBasicInfo(HttpListenerRequest request)
        {
            var mySession = MySession.Static;
            return new ServerStatus(
                mySession?.Ready ?? false,
                mySession?.Players.GetOnlinePlayers().Count(it => it.IsRealPlayer),
                mySession?.Name
            );
        }
    }
}