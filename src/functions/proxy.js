const https = require('https')

exports.handler = function(event, context, callback) {
  const path = event.queryStringParameters.path || event.path
  console.log('got req', path)
  context.callbackWaitsForEmptyEventLoop = false

  https.request({ hostname: 'j_f.keybase.pub', path, method: event.httpMethod, headers: event.headers }, res => {
    console.log('got res')
    return callback(null, { statusCode: 200, isBase64Encoded: false, body: path })
    const chunks = []
    let len = 0
    res.on('data', (chunk) => {
      chunks.push(chunk)
      len += chunk.length
    })
    res.on('error', err => callback(err, null))
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
  }).on('error', err => callback(err, null))
}
