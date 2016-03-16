import BufferedPresence from '../src/buffered_presence'
import ArpScan from '../src/providers/arpscan'
import WebHooks from '../src/webhooks'
import FileStorage from '../src/file_storage'
import Server from '../src/server'
import config from '../config'

const presence = new BufferedPresence({
  interval: config.presence.interval, // ms
  // update: false,
  providers: [
    new ArpScan()
  ],

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

const server = new Server(presence, {
  mount: {
    hooks: webHooks.router
  }
})

server.listen(config.server.port, () => {
  console.log(`listening on ${config.server.port}`)
})
