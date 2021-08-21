using System;
using LagGridBroadcaster;
using Torch.API.Managers;
using Torch.API.Plugins;

namespace ServerMonitor
{
    public static class ThirdPartyPluginReference
    {
        // ReSharper disable once InconsistentNaming
        private static readonly Lazy<LagGridBroadcasterPlugin> _lagGridBroadcasterPlugin =
            new Lazy<LagGridBroadcasterPlugin>(
                () => GetPluginByGuid<LagGridBroadcasterPlugin>("dd316db4-5d89-4db2-aa47-dac2a1a0ea64")
            );

        public static LagGridBroadcasterPlugin LagGridBroadcasterPlugin => _lagGridBroadcasterPlugin.Value;

        private static T GetPluginByGuid<T>(string guid) where T : ITorchPlugin
        {
            return (T)ServerMonitorPlugin.Instance.Torch.Managers.GetManager<IPluginManager>()?.Plugins[new Guid(guid)];
        }
    }
}