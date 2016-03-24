import ping from 'ping'
import Base from './base'

export default class Ping extends Base {
  static type = 'ping'

  constructor (options = {}) {
    super(options)
    this.timeout = options.timeout ||  2
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
        this.ping(id).then((res) => {
          const time = Date.now()
          const {alive} = res
          this.state[id] = {
            present: alive,
            time
          }
          if (alive) {
            result.push({
              id: id,
              last: time,
              type: Ping.type
            })
          }
          done()
        })
        .catch(done)
      })
      done()
    })
  }

  ping (ip) {
    return ping.promise.probe(ip, {
      timeout: this.timeout
    })
  }

}
