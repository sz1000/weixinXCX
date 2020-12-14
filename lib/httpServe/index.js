import interceptorManege from './interceptorManager'


export default class HttpServe extends interceptorManege {
  constructor(options) {
    super(options)
    this.defaultConfig = options
  }

  get(options) {
    if (options && options.id) {
      this.defaultConfig.id = options.id
    } else {
      this.defaultConfig.id = ''
    }
    if (options && options.param) {
      this.defaultConfig.param = options.param
    } else {
      this.defaultConfig.param = ''
    }

    this.defaultConfig.method = 'get'
    return this.request(this.defaultConfig)
  }

  delete(options) {
    if (options && options.id) {
      this.defaultConfig.id = options.id
    }
    this.defaultConfig.method = 'delete'
    return this.request(this.defaultConfig)
  }

  post(data) {
    this.defaultConfig.method = 'post'
    this.defaultConfig.data = data
    return this.request(this.defaultConfig)
  }

  put(options) {

    if (options && options.id) {
      this.defaultConfig.id = options.id
    }
    if (options && options.param) {
      this.defaultConfig.param = options.param
    }
    if (options && options.data) {
      this.defaultConfig.data = options.data
    }

    this.defaultConfig.method = 'put'
    return this.request(this.defaultConfig)
  }

  path(data) {
    this.defaultConfig.method = 'path'
    this.defaultConfig.data = data
    return this.request(this.defaultConfig)
  }

}