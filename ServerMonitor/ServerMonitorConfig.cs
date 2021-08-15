using Torch;

namespace ServerMonitor
{
    public class ServerMonitorConfig : ViewModel
    {
        private ushort _port = 5000;

        public ushort Port
        {
            get => _port;
            set => SetValue(ref _port, value);
        }
    }
}