using System;
using LagGridBroadcaster;
using Torch.API.Managers;
using Torch.API.Plugins;

namespace ServerMonitor
{
    public static class ThirdPartyPluginReference
    {
        private static readonly Guid LagGridBroadcasterPluginGuid = new Guid("dd316db4-5d89-4db2-aa47-dac2a1a0ea64");
        private static readonly Guid GlobalMarketPluginGuid = new Guid("025e099c-c046-4d4a-89c4-d770fe485e16");
        private static readonly Guid AleOwnershipLoggerGuid = new Guid("223bab51-ce22-48a7-9b6f-3c37e5da37a2");

        // ReSharper disable once InconsistentNaming
        private static readonly Lazy<ITorchPlugin> _lagGridBroadcasterPlugin = new Lazy<ITorchPlugin>(
            () => TryGetPlugin(LagGridBroadcasterPluginGuid)
        );

        public static bool LagGridBroadcasterPluginEnabled =>
            _lagGridBroadcasterPlugin.Value?.State == PluginState.Enabled;

        public static LagGridBroadcasterPlugin LagGridBroadcasterPlugin =>
            (LagGridBroadcasterPlugin)_lagGridBroadcasterPlugin.Value;

        private static ITorchPlugin TryGetPlugin(Guid guid)
        {
            ServerMonitorPlugin.Instance.Torch.Managers.GetManager<IPluginManager>()
                .Plugins
                .TryGetValue(guid, out var plugin);
            return plugin;
        }
    }
}