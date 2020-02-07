const qs = require('querystring')
const { request } = require('https')

exports.handler = function(event, context, callback) {
  const { path } = event.queryStringParameters
  console.log('request for', path)

  request(`https://j_f.keybase.pub/${path}`, { method: event.httpMethod }, res => {
    console.log('got res')
    const chunks = []
    let len = 0
    res.on('data', (chunk) => {
      chunks.push(chunk)
      len += chunk.length
    })
    res.on('error', callback)
    res.on('end', () => {
      const data = Buffer.concat(chunks, len)
      console.log('got data')
      callback(null, {
        statusCode: res.statusCode,
        headers: {
          ...res.headers,
          'Access-Control-Allow-Origin': event.headers.Origin,
          'Vary': (res.headers.vary || '').split(/,\s*/).concat('Origin').join(', '),
        },
        isBase64Encoded: true,
        body: data.toString('base64')
      })
    })
  }).on('error', callback)
}
