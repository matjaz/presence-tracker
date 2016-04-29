#!/usr/bin/env node

import 'babel-polyfill'
import {readFileSync} from 'fs'
import start from '../src/start'

if (process.argv.length === 3 && process.argv[2] === '-v') {
  console.log(`Version: ${require('../package').version}`)
  process.exit()
}

if (process.argv.length !== 4 || process.argv[2] !== '-c') {
  console.error('Usage: presence-tracker -c configfile')
  process.exit(1)
}

const config = JSON.parse(readFileSync(process.argv[3], 'utf8'))

start(config)
