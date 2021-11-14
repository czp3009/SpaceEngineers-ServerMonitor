using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using ServerMonitor.Web.BackEnd.HttpException;

#pragma warning disable 1998

namespace ServerMonitor.Web.BackEnd.Controller
{
    public class LagGridBroadcasterController
    {
        private static ServerMonitorConfig Config => ServerMonitorPlugin.Instance.Config;

        [SuppressMessage("ReSharper", "MemberCanBeMadeStatic.Global")]
        public async Task<object> GetLatestMeasureResult(HttpListenerRequest request)
        {
            if (!Config.LagGridBroadcasterPluginAvailable)
            {
                throw new HttpStatusException(HttpStatusCode.BadRequest, "LagGridBroadcaster not supported");
            }

            return GetLatestMeasureResultInternal();
        }

        private static object GetLatestMeasureResultInternal()
        {
            var lagGridBroadcasterPlugin = ThirdPartyPluginReference.LagGridBroadcasterPlugin;
            return new
            {
                latestMeasureTime = lagGridBroadcasterPlugin.LatestMeasureTime,
                latestResults = lagGridBroadcasterPlugin.LatestResults?.Values.Select(it =>
                    new
                    {
                        entityId = it.EntityId,
                        entityDisplayName = it.EntityDisplayName,
                        mainThreadTimePerTick = it.MainThreadTimePerTick,
                        playerIdentityId = it.PlayerIdentityId,
                        playerSteamId = it.PlayerSteamId,
                        playerDisplayName = it.PlayerDisplayName,
                        factionId = it.FactionId,
                        factionName = it.FactionName
                    }
                )
            };
        }
    }
}