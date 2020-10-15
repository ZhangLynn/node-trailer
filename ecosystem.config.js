module.exports = {
  apps : [{
    script: './server/index.js',
    watch: '.',
    name: 'trailer',
    env: {
      COMMON_VARIABLE: 'true'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      user : 'root',
      host : '122.51.186.171',
      port: '22',
      ref  : 'origin/master',
      repo : 'https://github.com/ZhangLynn/node-trailer',
      ssh_options: 'StrictHostKeyChecking=no',
      path : '/www/node-trailer/production',
      'pre-deploy-local': 'git fetch --all',
      'post-deploy' : 'cnpm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
