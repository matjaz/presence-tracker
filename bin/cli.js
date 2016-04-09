import 'babel-polyfill'
import {readFileSync} from 'fs'
import BufferedPresence from '../src/buffered_presence'
import WebHooks from '../src/webhooks'
import FileStorage from '../src/file_storage'
import Server from '../src/server'

if (process.argv.length !== 4 || process.argv[2] !== '-c') {
  console.error('Usage: presence-tracker -c configfile')
  process.exit(1)
}

const config = JSON.parse(readFileSync(process.argv[3], 'utf8'))

const mount = {}
const providers = []

for (let providerName in config.providers) {
  let Provider = require(`../src/providers/${providerName}`).default
  let provider = new Provider(config.providers[providerName])
  let router = provider.router
  providers.push(provider)
  if (router) {
    mount[`providers/${providerName}`] = router
  }
}

const presence = new BufferedPresence({
  ...config.presence,
  providers,
})
// .on('present', (present) => {
//   console.log('present', present.map((p) => p.id).join(','))
// })
// .on('absent', (absent) => {
//   console.log('absent', absent.map((p) => p.id).join(','))
// })

if (config.storage) {
  const storage = new FileStorage(presence, {
    path: config.storage.path
  })
}

if (config.hooks) {
  const webHooks = new WebHooks(presence, {
    hooks: config.hooks
  })

  mount.hooks = webHooks.router
}

if (config.server) {
  const server = new Server(presence, {
    ...config.server,
    mount
  })

  server.listen(config.server.port, () => {
    console.log(`listening on ${config.server.port}`)
  })  
}
