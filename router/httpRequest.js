
const request = require('axios');
const logsUtil = require('../util/handle-logger');

const httpRequest = async (obj) => {
  var options = {
    method: obj.method || 'get',
    url: obj.url,
    baseURL: obj.baseURL || '',
    // json: {
    //   'shop_no': '11047059',
    //   'origin_id': 'o_111',
    //   'city': '深圳',
    //   'cargo_price': '10.00',
    //   'is_prepay': '1',
    //   'receiver_name': '张三',
    //   'receiver_address': '深圳市南山区南山大道时代骄子大厦',
    //   'receiver_phone': '13760264461',
    //   'source_id': '73753',
    //   'ship_type_id': 3
    // },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  // 需指定这个参数 否则 在特定的环境下 会引起406错误
    }
  };
  if (obj.method === 'get' || obj.method === undefined) {
    options.method = 'get';
    options.params = obj.data || null;
  }
  if (obj.method === 'post') {
    options.data = obj.data || null;
  }
  if (obj.header) {
    for (const [key, value] of Object.entries(obj.header)) {
      options.headers[key] = value;
    }
  }
  logsUtil.logRequest(options);
  return await request(options).then(res => {
    return {
      code: res.status,
      success: true,
      result: res.data
    };
  }).catch(err => {
    return {
      code: err.response.status,
      success: false,
      result: err.response.data
    };
  });
  //
  // return await request(options, function (err, response, body) {
  //   // return err;
  //   if (err) {
  //     // console.log(err);
  //     // obj.err(err);
  //     return {
  //       code: response.statusCode,
  //       success: false,
  //       result: err
  //     };
  //   } else {
  //     // console.log(body, response.statusCode, 'response');
  //     // obj.success(body);
  //     return {
  //       code: response.statusCode,
  //       success: true,
  //       result: body
  //     };
  //   }
  // });
};

module.exports = httpRequest;
