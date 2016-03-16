import {writeFile} from 'fs'
import Storage from './storage'

export default class FileStorage extends Storage {
  constructor (presence, options) {
    super(presence, options)
    this.path = options.path
  }

  load () {
    return new Promise((resolve) => {
      this.data = require(this.path)
      resolve()
    })
  }

  save () {
    return new Promise((resolve) => {
      writeFile(this.path, JSON.stringify(this.data))
      resolve()
    })
  }
}
