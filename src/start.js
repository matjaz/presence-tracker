import BufferedPresence from '../src/buffered_presence'
import WebHooks from '../src/webhooks'
import FileStorage from '../src/file_storage'
import Server from '../src/server'


export default function start (options) {
  const mount = {}
  const providers = []

  for (let providerName in options.providers) {
    let Provider = require(`../src/providers/${providerName}`).default
    let provider = new Provider(options.providers[providerName])
    let router = provider.router
    providers.push(provider)
    if (router) {
      mount[`providers/${providerName}`] = router
    }
  }

  const presence = new BufferedPresence({
    ...options.presence,
    providers
  })
  // .on('present', (present) => {
  //   console.log('present', present.map((p) => p.id).join(','))
  // })
  // .on('absent', (absent) => {
  //   console.log('absent', absent.map((p) => p.id).join(','))
  // })

  if (options.storage) {
    const storage = new FileStorage(presence, {
      path: options.storage.path
    })
  }

  if (options.hooks) {
    const webHooks = new WebHooks(presence, {
      hooks: options.hooks
    })

    mount.hooks = webHooks.router
  }

  if (options.server) {
    const server = new Server(presence, {
      ...options.server,
      mount
    })

    server.listen(options.server.port, () => {
      console.log(`listening on ${options.server.port}`)
    })
  }
}
