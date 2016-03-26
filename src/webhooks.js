import {parse} from 'url'
import {request} from 'http'
import {Router, bodyParser} from './server'

export default class Webhooks {

  constructor (presence, options) {
    this.presence = presence
    this.webhooks = {}
    this.hookId = 1
    if (options.hooks) {
      options.hooks.forEach((hook) => {
        this.add(hook.type, hook.url)
      })
    }
  }

  add (event, options) {
    var webhooks = this.webhooks[event]
    if (!webhooks) {
      webhooks = this.webhooks[event] = []
      this.presence.on(event, (data) => {
        webhooks.forEach((options) => {
          request(options)
            .on('error', console.error)
            .end(JSON.stringify({
              event: event,
              data: data
            }))
        })
      })
    }
    if (typeof options === 'string') {
      options = parse(options)
    }
    if (!options.method) {
      options.method = 'POST'
    }
    options.id = String(this.hookId++)
    var headers = options.headers || (options.headers = {})
    headers['content-type'] = 'application/json'
    webhooks.push(options)
    return options
  }

  get (id) {
    for (let type in this.webhooks) {
      let hook = this.webhooks[type].find((hook) => {
        return hook.id === id
      })
      if (hook) {
        return hook
      }
    }
  }

  remove (id) {
    for (let type in this.webhooks) {
      let index
      var webhooks = this.webhooks[type]
      let hook = webhooks.find((hook, i) => {
        index = i
        return hook.id === id
      })
      if (hook) {
        webhooks.splice(index, 1)
        return true
      }
    }
    return false
  }

  get router () {
    var router = new Router()
    router.param('id', (ctx, next, id) => {
      ctx.state.hook = this.get(id)
      ctx.assert(ctx.state.hook, 404)
      next()
    })

    router.get('/:id', (ctx) => {
      ctx.body = ctx.state.hook
    })
    router.delete('/:id', (ctx) => {
      ctx.status = this.remove(ctx.params.id) ? 204 : 404
    })

    router.get('/', (ctx) => {
      ctx.body = this.webhooks
    })
    router.post('/', bodyParser, (ctx) => {
      var body = ctx.request.body
      var {id} = this.add(body.event, body.options)
      ctx.set('Location', id)
      ctx.status = 201
      ctx.body = {
        id
      }
    })
    return router
  }
}
