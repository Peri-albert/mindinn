import 'wepy-async-function'
import Session from './session'
import Raven from './raven/raven.min'

let API_SERVER = 'https://127.0.0.1:3000' //没环境
// let API_SERVER = 'https://njapi.vxiaocheng.com' //测试环境
// let API_SERVER = 'https://preapi.vxiaocheng.com' //预发布环境
// let API_SERVER = 'https://api.vxiaocheng.com'; //生产环境
// let API_SERVER = 'http://devapi.vxiaocheng.com'; //开发环境

let ENV = API_SERVER == 'https://api.vxiaocheng.com' ? 'production' : 'test'

let defaultArgs = {
    '_v': 1
};

let buildArgs = function(args) {
    var mergedArgs = Object.assign({}, defaultArgs, args);
    var argList = [];

    if (mergedArgs) {
        Object.keys(mergedArgs).forEach((key) => {
            argList.push(key + '=' + encodeURIComponent(mergedArgs[key]));
        })
    }
    return argList.join('&');
};

let getUrl = function(resource, args, service = 'cube') {
    let pos = resource.lastIndexOf('.');
    let app = resource.substring(0, pos);
    let innerResource = resource.substring(pos + 1);

    let queryString = buildArgs(args);
    return `${API_SERVER}/${service}/${app}/${innerResource}/?${queryString}`
}

let Resource = {
    API_SERVER: API_SERVER,

    query(options) {
        let isGET = options.method === 'GET'

        let header = {
            'Accept': 'application/json',
            'Authorization': (Session.get() || '0')
        }

        if (header.Authorization == "0" && (options.service == "plutus" || options.service == "peanut")) {
            return null;
        }

        let url = null;
        let data = null;
        if (isGET) {
            url = getUrl(options.resource, options.data, options.service)
            data = {}
        } else {
            let _method = {}
            if (options.data.hasOwnProperty('_method')) {
                _method = { '_method': options.data['_method'] }
                delete options['_method']
            }
            url = getUrl(options.resource, _method, options.service)
            data = options.data
            header['content-type'] = 'application/x-www-form-urlencoded';
        }

        data["__source_service"] = "paopao"

        console.debug(`[resource] ${options.method} ${url}`);
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                method: options.method,
                data: data,
                header: header,
                success: res => {
                    console.log('return from server')
                    let badUrl = url;
                    if (res.statusCode === 200) {
                        let businessData = res.data.data;
                        if (res.data.code == 200) {
                            resolve(businessData, res.data);
                        } else {
                            res.isBusinessError = true
                            let errCode = "";
                            if (res.data && res.data.errCode) {
                                errCode = res.data.errCode;
                            }
                            let message = {
                                "url": badUrl,
                                "res": res
                            };
                            Raven.captureMessage(JSON.stringify(message), {
                                level: 'error'
                            });
                            Raven.setTagsContext({
                                "errCode": errCode
                            });
                            reject(res)
                        }
                    } else {
                        res.isBusinessError = false
                        let errCode = "";
                        if (res.data && res.data.errCode) {
                            errCode = res.data.errCode;
                        }
                        let message = {
                            "url": badUrl,
                            "res": res
                        };
                        Raven.captureMessage(JSON.stringify(message), {
                            level: 'error'
                        });
                        Raven.setTagsContext({
                            "errCode": errCode
                        });
                        reject(res);
                    }
                },
                fail: res => {
                    res.isBusinessError = false
                    let errCode = "";
                    if (res.data && res.data.errCode) {
                        errCode = res.data.errCode;
                    }
                    let message = {
                        "url": badUrl,
                        "res": res
                    };
                    Raven.captureMessage(JSON.stringify(message), {
                        level: 'error'
                    });
                    Raven.setTagsContext({
                        "errCode": errCode
                    });
                    reject(res);
                }
            })
        })
    },

    get(options) {
        options.method = 'GET'
        return this.query(options)
    },

    put(options) {
        options.method = 'POST'
        options.data['_method'] = 'put'
        return this.query(options)
    },

    post(options) {
        options.method = 'POST'
        return this.query(options)
    },

    delete(options) {
        options.method = 'POST'
        options.data['_method'] = 'delete'
        return this.query(options)
    },

    isDevMode() {
        return API_SERVER.indexOf("http://devapi.vxiaocheng.com") != -1
    }
}

export default Resource;
export { ENV };