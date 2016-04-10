import {join} from 'path'

export function configPath (path) {
  if (path.charAt(0) !== '/') {
    return join(__dirname, '..', '..', 'data', path)
  }
  return path
}
