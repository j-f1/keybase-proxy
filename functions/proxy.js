const fetch = require('node-fetch').default

exports.handler = async function(event, context) {
  const path = event.queryStringParameters.path || event.path
  console.log('got req', path)

  const res = await fetch(`https://j_f.keybase.pub/${path}`, {
    method: event.httpMethod,
    headers: { ...event.headers, host: 'j_f.keybase.pub' },
  })
  console.log('got res')
  const data = await res.buffer()
  console.log('got data')
  return {
    statusCode: res.status,
    headers: {
      ...res.headers,
      'Access-Control-Allow-Origin': '*',
    },
    isBase64Encoded: true,
    body: data.toString('base64'),
  }
}
