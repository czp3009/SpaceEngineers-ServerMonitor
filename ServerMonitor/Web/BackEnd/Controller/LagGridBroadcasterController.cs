using System.Linq;
using System.Net;
using System.Threading.Tasks;
using LagGridBroadcaster;
using ServerMonitor.Web.BackEnd.HttpException;

namespace ServerMonitor.Web.BackEnd.Controller
{
    public class LagGridBroadcasterController
    {
        private readonly LagGridBroadcasterPlugin _lagGridBroadcasterPlugin =
            ThirdPartyPluginReference.LagGridBroadcasterPlugin;

        public async Task<object> GetLatestMeasureResult(HttpListenerRequest request)
        {
            if (_lagGridBroadcasterPlugin == null)
            {
                throw new HttpStatusException(HttpStatusCode.BadRequest, "LagGridBroadcaster not supported");
            }

            return new
            {
                latestMeasureTime = _lagGridBroadcasterPlugin.LatestMeasureTime,
                latestResults = _lagGridBroadcasterPlugin.LatestResults?.Values.Select(it =>
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