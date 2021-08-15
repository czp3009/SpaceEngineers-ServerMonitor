namespace ServerMonitor.Web.BackEnd.Model
{
    // ReSharper disable MemberCanBePrivate.Global
    public class ServerStatus
    {
        public readonly bool IsReady;
        public readonly int? Players;
        public readonly string SessionName;

        public ServerStatus(bool isReady, int? players, string sessionName)
        {
            IsReady = isReady;
            Players = players;
            SessionName = sessionName;
        }
    }
}