import {EventEmitter} from 'events'
import difference from 'lodash.difference'

export default class Presence extends EventEmitter {

  constructor (options) {
    super()
    this.state = {}
    this.setProviders(options.providers)
    this.start(options.interval)
    if (options.update !== false) {
      this.update()
    }
  }

  update () {
    this.providers.forEach(async function (provider) {
      var presence = await provider.fetch()
      var {added, removed} = this.diff(this.state, presence)
      if (added.length) {
        added.forEach((p) => {
          this.state[p.id] = p
        })
        this.emit('present', added)
      }
      if (removed.length) {
        removed.forEach((p) => {
          delete this.state[p.id]
        })
        this.emit('absent', removed)
      }
      this.emit('update', this.state)
    }.bind(this))
    return this
  }

  diff (currentPresence, newPresence) {
    var currentIds = Object.keys(currentPresence)
    var addedIds = newPresence.map((p) => p.id)
    return {
      added: newPresence.filter((p) => !currentPresence[p.id]),
      removed: difference(currentIds, addedIds).map((id) => currentPresence[id])
    }
  }

  start (interval) {
    if (interval && !this._updateInterval) {
      this._updateInterval = setInterval(() => {
        this.update()
      }, interval)
      return true
    }
  }

  stop () {
    if (this._updateInterval) {
      clearInterval(this._updateInterval)
      this._updateInterval = null
      return true
    }
  }

  setData (id, data) {
    return new Promise((resolve, reject) => {
      var presence = this.state[id]
      if (!presence) {
        reject('Not found')
        return
      }
      if (data) {
        let d = presence.data || (presence.data = {})
        for (let k in data) {
          let val = data[k]
          if (val === null) {
            delete d[k]
          } else {
            d[k] = data[k]
          }
        }
      } else {
        delete presence.data
      }
      this.emit('dataSet', presence)
      resolve()
    })
  }

  setProviders (providers) {
    this.providers = providers
  }
}
