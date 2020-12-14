import interceptorManager from './interceptorManager.js'

export default function httpServe(params) {
  let context = new interceptorManager(params)
  return context.request()
}