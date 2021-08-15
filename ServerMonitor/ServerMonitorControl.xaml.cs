using System.Windows;

namespace ServerMonitor
{
    public partial class ServerMonitorControl
    {
        private readonly ServerMonitorPlugin _plugin;

        private ServerMonitorControl()
        {
            InitializeComponent();
        }

        public ServerMonitorControl(ServerMonitorPlugin plugin) : this()
        {
            _plugin = plugin;
            DataContext = plugin.Config;
        }

        private void SaveButton_OnClick(object sender, RoutedEventArgs e)
        {
            _plugin.SaveConfig();
        }

        private void RestartHttpServer_OnClick(object sender, RoutedEventArgs e)
        {
            _plugin.RestartHttpServer();
        }
    }
}