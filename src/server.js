import Koa from 'koa'
import Router from 'koa-66'
import convert from 'koa-convert'
import koaBodyParser from 'koa-body-parser'
import pkg from '../package'

export const bodyParser = convert(koaBodyParser())

export default class Server {

  constructor (presence, options) {
    this.presence = presence
    this.mount = options && options.mount
  }

  get app () {
    if (!this._app) {
      const app = new Koa()
      app.use(async function (ctx, next) {
        const start = new Date()
        await next()
        const ms = new Date() - start
        ctx.set('X-Response-Time', ms + 'ms')
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
      })
      app.use(async function (ctx, next) {
        await next()
        if (ctx.method === 'HEAD') {
          ctx.remove('Content-Type')
          ctx.body = ''
        }
      })
      app.use((ctx, next) => {
        if (ctx.request.type && ctx.request.type !== 'application/json') {
          ctx.throw(415)
        } else {
          return next()
        }
      })
      this._app = app
    }
    return this._app
  }

  get router () {
    if (!this._router) {
      this._router = new Router()
    }
    return this._router
  }

  initRoutes () {
    var self = this
    var router = this.router
    if (this.mount) {
      for (let path in this.mount) {
        router.mount('/' + path, this.mount[path])
      }
    }
    router.param('id', (ctx, next, id) => {
      ctx.state.presence = this.presence.state[id]
      ctx.assert(ctx.state.presence, 404)
      return next()
    })
    router.get('/', (ctx) => {
      const filterKeys = Object.keys(ctx.query)
      if (filterKeys.length) {
        let state = ctx.body = {}
        for (let id in this.presence.state) {
          let device = this.presence.state[id]
          let match = true
          for (let key of filterKeys) {
            if (device[key] !== ctx.query[key]) {
              match = false
              break
            }
          }
          if (match) {
            state[id] = device
          }
        }
      } else {
        ctx.body = this.presence.state
      }
    })
    router.get('/.meta', (ctx) => {
      ctx.body = {
        version: pkg.version
      }
    })
    router.get('/:id', (ctx) => {
      ctx.body = ctx.state.presence
    })
    router.get('/:id/data', (ctx) => {
      ctx.body = ctx.state.presence.data
    })
    router.patch('/:id/data', bodyParser, async function (ctx) {
      try {
        ctx.body = await self.presence.setData(ctx.state.presence.id, ctx.request.body)
      } catch (e) {
        console.error(e)
      }
    })
    this.app.use(router.routes())
  }

  listen () {
    this.initRoutes()
    this.app.listen.apply(this.app, arguments)
  }
}
