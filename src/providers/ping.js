import ping from 'ping'
import Promise from 'bluebird'

import Base from './base'

export default class Ping extends Base {
  static type = 'ping'

  constructor (options = {}) {
    super(options)
    this.timeout = options.timeout ||  2
  }

  fetch () {
    const result = []
    const ids = this.items.map((item) => item.id)
    const promises = ids.map((id) => this.ping(id).reflect())
    return Promise.all(promises).each((inspection, index) => {
      if (inspection.isFulfilled()) {
        const id = ids[index]
        const state = this.state[id]
        const {alive} = inspection.value()
        // time & present are required fields for provider state
        state.time = Date.now()
        state.present = alive
        if (alive) {
          result.push({
            id: state.id,
            last: state.time,
            type: Ping.type
          })
        }
      }
    }).then(() => result)
  }

  ping (ip) {
    return Promise.resolve(ping.promise.probe(ip, {
      timeout: this.timeout
    }))
  }

}
