﻿using System;
using System.IO;
using System.Net;
using System.Windows.Controls;
using NLog;
using ServerMonitor.Web.BackEnd;
using Torch;
using Torch.API;
using Torch.API.Plugins;

namespace ServerMonitor
{
    // ReSharper disable once ClassNeverInstantiated.Global
    public class ServerMonitorPlugin : TorchPluginBase, IWpfPlugin
    {
        public static readonly Logger Log = LogManager.GetCurrentClassLogger();
        private HttpServer _httpServer;
        private Persistent<ServerMonitorConfig> _persistent;
        public static ServerMonitorPlugin Instance { get; private set; }
        public ServerMonitorConfig Config => _persistent.Data;

        public override void Init(ITorchBase torch)
        {
            base.Init(torch);
            Instance = this;
            LoadConfig();
            StartHttpServer();
        }

        public UserControl GetControl()
        {
            return new ServerMonitorControl(this);
        }

        public override void Dispose()
        {
            base.Dispose();
            _httpServer?.Stop();
            Log.Info("HttpServer stoped");
        }

        public void SaveConfig()
        {
            try
            {
                _persistent.Save();
                Log.Info("Configuration saved.");
            }
            catch (IOException e)
            {
                Log.Warn(e, "Configuration failed to save");
            }
        }

        public void RestartHttpServer()
        {
            lock (this)
            {
                StopHttpServer();
                StartHttpServer();
            }
        }

        private void LoadConfig()
        {
            var configFilePath = Path.Combine(StoragePath, $"{Name}.cfg");
            _persistent = Persistent<ServerMonitorConfig>.Load(configFilePath);
            Log.Info("Confifuration loaded");
        }

        private void StartHttpServer()
        {
            var port = Config.Port;
            var httpServer = new HttpServer(Config.Port);
            try
            {
                httpServer.Start();
            }
            catch (HttpListenerException)
            {
                Log.Error(
                    $"Can't listen on port {port}. Please run dedicated server in administrator mode or execute follwing command in shell:\n" +
                    $"netsh http add urlacl url=http://*:{port}/ user={Environment.UserDomainName}\\{Environment.UserName}"
                );
                return;
            }

            _httpServer = httpServer;
            Log.Info($"HttpServer stared on port {port}");
        }

        private void StopHttpServer()
        {
            if (_httpServer == null) return;
            _httpServer.Stop();
            _httpServer = null;
            Log.Info("HttpServer stoped");
        }
    }
}