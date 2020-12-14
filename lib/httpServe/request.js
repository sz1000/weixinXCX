import regeneratorRuntime, {
  async
} from './regeneration-runtime'

import config from './config';




export default class wxResource {
  constructor(options) {
    this.options = {
      url: options.url,
      method: options.method ? options.method : 'get',
      header: {
        'content-type': 'application/json',
      },
      data: options.data || {},
    };
    this.interceptors = {
      request: options.requestIntercepontor || [],
      response: options.responseIntercepontor || [],
    }
  }

  setRequestHook(hook) {
    this.interceptors.request = hook
  }

  setResponseHook(hook) {
    this.interceptors.response = hook
  }

  async request(url, method, header, data, id, param, Authorization) {

    let requestOptions = Object.assign({},
      this.options,
      url,
      method,
      header,
      data,
      id,
      param
    );

    let requestIntercepontorPromise = Promise.resolve(requestOptions)

    this.interceptors.request.forEach((processor) => {
      requestIntercepontorPromise = requestIntercepontorPromise.then(processor.bind(this))
    })

    requestOptions = await requestIntercepontorPromise

    requestOptions.url = `${config.apiHost + requestOptions.url}`;

    if (requestOptions.id) {
      requestOptions.url = `${requestOptions.url}/${requestOptions.id ? requestOptions.id : ''}`;
    }

    if (requestOptions.param) {
      let param = "?"
      for (let name in requestOptions.param) {
        let paramName = `${name}=${requestOptions.param[name]}&`
        param += paramName
      }
      requestOptions.url = `${requestOptions.url}${param.substring(0, param.length - 1)}`
    }


    let requestPromise = new Promise((resolve, reject) => {
      wx.request(
        Object.assign({}, requestOptions, 
          {
          success: responseData => {
            if(responseData.statusCode >= 400 && responseData.statusCode !== 404 ){
              reject(responseData)
            }else{
              resolve(responseData);
            }
          },
          fail: err => {
            reject(err)
            console.error('请求错误',err)
          },
        })
      );
    });

    let result = await requestPromise

    let responseIntercepontorPromise = Promise.resolve(result)

    this.interceptors.response.forEach((processor) => {
      responseIntercepontorPromise = responseIntercepontorPromise.then(processor.bind(this))
    })

    return responseIntercepontorPromise
  }
}