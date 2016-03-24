import Presence from './presence'

export default class BufferedPresence extends Presence {

  constructor (options) {
    super(options)
    this.addedCount = options.addedCount
    this.removedCount = options.removedCount
    this._bufferState = {}
  }

  diff (currentPresence, newPresence, type) {
    var diff = super.diff(currentPresence, newPresence, type)
    var status = this._bufferState
    diff.added = diff.added.filter((p) => {
      var id = p.id
      var pStatus = status[id]
      if (!pStatus) {
        pStatus = status[id] = {
          addedCount: 0,
          removedCount: 0
        }
      } else {
        pStatus.removedCount = 0
      }
      return ++pStatus.addedCount > this.addedCount || this.addedCount === 0
    })
    diff.removed = diff.removed.filter((p) => {
      var pStatus = status[p.id]
      if (!pStatus) {
        // not yet added
        return false
      }
      pStatus.addedCount = 0
      return ++pStatus.removedCount > this.removedCount || this.removedCount === 0
    })
    return diff
  }

}
