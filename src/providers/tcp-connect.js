import Promise from 'bluebird'
import {createConnection} from 'net'

import Base from './base'

export default class TCPConnect extends Base {
  static type = 'tcp-connect'

  constructor (options = {}) {
    super(options)
    this.timeout = options.timeout ||  2000 // ms
  }

  fetch () {
    const result = []
    const ids = this.items.map((item) => item.id)
    const promises = this.items.map((item) => this.connect(item).reflect())
    const update = (id, time, present) => {
      var state = this.state[id]
      state.time = time
      state.present = present
    }
    return Promise.all(promises).each((inspection, index) => {
      const id = ids[index]
      const time = Date.now()
      const present = inspection.isFulfilled()
      update(id, time, present)
      if (present) {
        result.push({
          id,
          last: time,
          type: TCPConnect.type
        })
      }
    }).then(() => result)
  }

  addItem (data) {
    const item = super.addItem(data)
    item.host = data.host
    item.port = data.port
    return item
  }

  connect (options) {
    return new Promise((resolve, reject) => {
      const socket = createConnection(options, () => {
        socket.end()
        resolve()
      })
      .on('error', (err) => {
        socket.end()
        reject(err)
      })
      .setTimeout(options.timeout || this.timeout, () => {
        socket.end()
        reject('timeout')
      })
    })
  }
}
