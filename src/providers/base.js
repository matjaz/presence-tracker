import JSONStore from 'json-store'

import {Router, bodyParser} from '../server'
import {configPath} from '../util'

export default class Base {

  constructor (options = {}) {
    const items = this.items = options.items || []
    if (options.path) {
      this.store = JSONStore(configPath(options.path))
      let storeItems = this.store.get('items')
      if (storeItems) {
        items.push(...storeItems)
      }
    }
    this.state = items.reduce((state, item) => {
      state[item.id] = item
      return state
    }, {})
  }

  // abstract fetch ()

  add (data) {
    var {id} = data
    if (this.state[id]) {
      return
    }
    const item = this.addItem(data)
    this.state[id] = undefined
    this.items.push(item)
    this.saveConfig()
    return item
  }

  remove (id) {
    if (!this.state[id]) {
      return
    }
    delete this.state[id]
    this.items.some((item, i) => {
      if (item.id === id) {
        this.items.splice(i, 1)
        return true
      }
    })
    this.saveConfig()
    return true
  }

  addItem (data) {
    return {
      id: data.id
    }
  }

  saveConfig () {
    if (this.store) {
      this.store.set('items', this.items)
    }
  }

  get router () {
    const self = this
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
    router.delete('/:id', async function (ctx) {
      const success = await self.remove(ctx.params.id)
      ctx.status = success ? 204 : 404
    })
    router.post('/', bodyParser, async function (ctx) {
      const resp = await self.add(ctx.request.body)
      if (resp) {
        ctx.set('Location', resp.id)
        ctx.status = 201
        ctx.body = resp
      } else {
        ctx.status = 409
      }
    })
    return router
  }
}
