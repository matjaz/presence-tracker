import {createConnection} from 'net'
import Base from './base'

export default class TCPConnect extends Base {
  static type = 'tcp-connect'

  constructor (options = {}) {
    super(options)
    this.timeout = options.timeout ||  2000 // ms
  }

  fetch () {
    return new Promise((resolve) => {
      var remaining = 1
      const result = []
      const done = () => {
        if (!--remaining) {
          resolve(result)
        }
      }
      this.items.forEach((item) => {
        remaining++
        const {id} = item
        const time = Date.now()
        const update = (present) => {
          this.state[id] = {
            present,
            time
          }
        }
        this.connect(item).then(() => {
          update(true)
          result.push({
            id: id,
            last: time,
            type: TCPConnect.type
          })
          done()
        })
        .catch(() => {
          update(false)
          done()
        })
      })
      done()
    })
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
        reject(err)
        socket.end()
      })
      .setTimeout(options.timeout || this.timeout, () => {
        reject('timeout')
        socket.end()
      })
    })
  }
}
