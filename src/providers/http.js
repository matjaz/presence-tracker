import {Router} from '../server'

export default class Http {
  static type = 'http'

  constructor () {
    this.state = {}
  }

  fetch () {
    var result = []
    for (let id in this.state) {
      const item = this.state[id]
      result.push({
        id: item.id,
        last: item.time,
        type: Http.type
      })
    }
    return result
  }

  markPresent (id) {
    var item = this.state[id]
    if (!item) {
      this.state[id] = item = {
        id
      }
    }
    item.time = Date.now()
  }

  remove (id) {
    var item = this.state[id]
    if (!item) {
      return
    }
    delete this.state[id]
  }

  get router () {
    const router = new Router()
    router.param('id', (ctx, next, id) => {
      ctx.state.itemData = this.state[id]
      ctx.assert(ctx.state.itemData, 404)
      next()
    })

    router.get('/', (ctx) => {
      ctx.body = this.state
    })
    router.get('/:id', (ctx) => {
      ctx.body = ctx.state.itemData
    })
    router.post('/:xid/present', (ctx) => {
      this.markPresent(ctx.params.xid)
      ctx.status = 204
    })
    router.delete('/:id', (ctx) => {
      this.remove(ctx.params.id)
      ctx.status = 204
    })
    return router
  }

}
