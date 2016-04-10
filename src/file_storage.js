import {statSync, writeFile} from 'fs'
import Storage from './storage'
import {configPath} from './util'

export default class FileStorage extends Storage {
  constructor (presence, options) {
    super(presence, options)
    this.path = configPath(options.path)
  }

  load () {
    try {
      statSync(this.path)
      this.data = require(this.path)
    } catch (e) {}
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
