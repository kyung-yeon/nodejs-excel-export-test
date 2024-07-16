module.exports = {
  apps: [{
    name: 'app',
    script: './dist/main.js',
    instances: 1,
    exec_mode: 'cluster',
    max_memory_restart: '4G'
}]
}