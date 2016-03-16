// abstract
export default class Storage {
  constructor (presence, options) {
    this.presence = presence
    this.data = {}
    this.init()
  }

  init () {
    this.presence
      .on('present', (present) => {
        var data = this.data
        present.forEach((p) => {
          var id = p.id
          if (data[id]) {
            this.presence.setData(id, data[id])
          }
        })
      })
      .on('dataSet', (p) => {
        this.data[p.id] = p.data
        this.save()
      })
    setImmediate(this.load.bind(this))
  }

  // abstract
  // load ()
  // save ()
}
