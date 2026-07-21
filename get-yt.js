const https = require('https');
https.get('https://www.youtube.com/results?search_query=5+Zoom+Virtual+or+Team+Building+Activities', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (match) {
      console.log('ID:', match[1]);
    } else {
      console.log('not found');
    }
  });
});
