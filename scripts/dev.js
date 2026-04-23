const { spawn } = require('child_process')

const nextBin = require.resolve('next/dist/bin/next')

const child = spawn(process.execPath, [nextBin, 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CHOKIDAR_USEPOLLING: '1',
    WATCHPACK_POLLING: 'true',
  },
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
