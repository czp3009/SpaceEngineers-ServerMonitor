using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Sandbox.Game.World;

namespace ServerMonitor.Web.BackEnd.Controller
{
    public class BasicInfoController
    {
        public async Task<object> GetBasicInfo(HttpListenerRequest request)
        {
            var mySession = MySession.Static;
            return new
            {
                isReady = mySession?.Ready ?? false,
                players = mySession?.Players.GetOnlinePlayers().Count(it => it.IsRealPlayer),
                sessionName = mySession?.Name
            };
        }
    }
}