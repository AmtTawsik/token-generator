import google from '@googleapis/gmail'
import fs from 'fs'
import credentials from './Credentials.json' assert {type:'json'};

const code ='4/0AZEOvhVlaqFyb5hcUnhDcOffrMRQmKqA-wxiLFB6n6tDcGZaJhdsiZ_E1Zg5pLjZEowSzQ'

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.getToken(code).then(({ tokens }) => {
  console.log(tokens)
  fs.writeFileSync('token.json', JSON.stringify(tokens));
  console.log('Access token and refresh token stored to token.json');
});