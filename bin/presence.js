import BufferedPresence from '../src/buffered_presence'
import WebHooks from '../src/webhooks'
import FileStorage from '../src/file_storage'
import Server from '../src/server'
import config from '../config'

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
  interval: config.presence.interval, // ms
  update: config.presence.update,
  providers,

  // buffered config
  addedCount: config.presence.addedCount,
  removedCount: config.presence.removedCount
})
// .on('present', (present) => {
//   console.log('present', present.map((p) => p.id).join(','))
// })
// .on('absent', (absent) => {
//   console.log('absent', absent.map((p) => p.id).join(','))
// })

const storage = new FileStorage(presence, {
  path: config.storage.path
})
storage

const webHooks = new WebHooks(presence, {
  hooks: config.hooks
})

mount.hooks = webHooks.router

const server = new Server(presence, {
  mount
})

server.listen(config.server.port, () => {
  console.log(`listening on ${config.server.port}`)
})
