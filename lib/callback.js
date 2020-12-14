class CallbackPool {
  constructor() {
    this.id = 0
    this.pool = {}
  }

  regist(callback) {
    this.id++
    this.pool[this.id] = callback
    return this.id
  }

  get(id) {
    let result = this.pool[id]
    delete this.pool[id]
    return result
  }
}
module.exports = new CallbackPool()