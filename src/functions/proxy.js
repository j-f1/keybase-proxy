const qs = require('querystring')
const { promisify } = require('util')
const request = promisify(require('https').get)

exports.handler = async function(event, context) {
  const { path } = event.queryStringParameters
  const res = await request(`https://j_f.keybase.pub/${path}`, { method: event.httpMethod })

  const data = await new Promise((resolve, reject) => {
    const chunks = []
    let len = 0
    res.on('data', (chunk) => {
      chunks.push(chunk)
      len += chunk.length
    })
    res.on('error', reject)
    res.on('end', () => {
      resolve(Buffer.concat(chunks, len))
    })
  })

  return {
    statusCode: res.statusCode,
    headers: {
      ...res.headers,
      'Access-Control-Allow-Origin': event.headers.Origin,
      'Vary': (res.headers.vary || '').split(/,\s*/).concat('Origin').join(', '),
    },
    isBase64Encoded: true,
    body: data.toString('base64')
  }
}