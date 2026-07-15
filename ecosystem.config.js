// PM2 process manager config — an alternative to docker-compose.yml for
// deployments running directly on a VM (bare metal / EC2 / droplet).
//
// Usage:
//   npm install -g pm2
//   cd backend && npm ci --omit=dev
//   pm2 start ecosystem.config.js --env production
//   pm2 save && pm2 startup   # persist across reboots
//
// The frontend is a static build (see DEPLOYMENT.md) served by a system
// Nginx install, not by PM2 — PM2 only manages the Node backend process.
module.exports = {
  apps: [
    {
      name: "online-exam-backend",
      cwd: "./backend",
      script: "server.js",
      // NOTE: this app uses Socket.IO for live proctoring/monitoring.
      // Running more than 1 instance (cluster mode) requires a shared
      // adapter (e.g. @socket.io/redis-adapter) so that a violation
      // broadcast from one worker reaches examiners connected to a
      // different worker — that adapter isn't wired up in this codebase.
      // Scale vertically (bigger box) or add the Redis adapter + sticky
      // sessions before increasing `instances` below 1.
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
      },
      max_memory_restart: "500M",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
