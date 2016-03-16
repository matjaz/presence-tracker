import arpscan from 'arpscan'

export default class ArpScan {
  static type = 'arpscan'

  fetch () {
    return new Promise((resolve, reject) => {
      arpscan((err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data.map((presence) => ({
          // required fields
          id: presence.mac,
          last: presence.timestamp,
          type: ArpScan.type,

          // additional data
          ip: presence.ip,
          vendor: presence.vendor !== '(Unknown)' && presence.vendor || null
        })))
      })
    })
  }
}
