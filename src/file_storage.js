import {writeFile} from 'fs'
import Storage from './storage'

export default class FileStorage extends Storage {
  constructor (presence, options) {
    super(presence, options)
    this.path = options.path
  }

  load () {
    this.data = require(this.path)
  }

  save () {
    return new Promise((resolve, reject) => {
      writeFile(this.path, JSON.stringify(this.data), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
