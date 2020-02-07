const qs = require('querystring')
const { request } = require('https')

exports.handler = async function(event, context) {
  try {
  const { path } = event.queryStringParameters
  console.log('request for', path)
  const res = await new Promise((resolve, reject) => {
    request(
      `https://j_f.keybase.pub/${path}`,
      { method: event.httpMethod },
      resolve
    )
    .on('error', reject)
  })
  console.log('got res')

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
  console.log('got data')

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
  } catch (e) {
    console.log(e)
    return { statusCode: 500, body: e.toString(), isBase64Encoded: false }
  }
}
