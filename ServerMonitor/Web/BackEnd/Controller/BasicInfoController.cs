using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Sandbox.Game.World;

namespace ServerMonitor.Web.BackEnd.Controller
{
    public class BasicInfoController
    {
        private static ServerMonitorConfig Config => ServerMonitorPlugin.Instance.Config;

        public async Task<object> GetBasicInfo(HttpListenerRequest request)
        {
            var mySession = MySession.Static;
            return new
            {
                messageOfToday = Config.MessageOfToday,
                isReady = mySession?.Ready ?? false,
                players = mySession?.Players.GetOnlinePlayers().Count(it => it.IsRealPlayer),
                sessionName = mySession?.Name,
                thirdPartyPluginSupport = new
                {
                    lagGridBroadcasterPlugin = Config.LagGridBroadcasterPluginAvailable
                }
            };
        }
    }
}