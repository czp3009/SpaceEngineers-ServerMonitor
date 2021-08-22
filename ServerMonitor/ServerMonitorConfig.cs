using Torch;

namespace ServerMonitor
{
    public class ServerMonitorConfig : ViewModel
    {
        private bool _lagGridBroadcasterPluginSupport = true;
        private ushort _port = 5000;

        public ushort Port
        {
            get => _port;
            set => SetValue(ref _port, value);
        }

        // ReSharper disable once MemberCanBeMadeStatic.Global
        public bool LagGridBroadcasterPluginEnabled =>
            ThirdPartyPluginReference.LagGridBroadcasterPluginEnabled;

        public bool LagGridBroadcasterPluginSupport
        {
            get => _lagGridBroadcasterPluginSupport;
            set => SetValue(ref _lagGridBroadcasterPluginSupport, value);
        }
    }
}