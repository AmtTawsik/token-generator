import google from '@googleapis/gmail'
import credentials from './Credentials.json' assert {type:'json'};


const { client_secret, client_id, redirect_uris } = credentials.web;
const OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
const url = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope:['https://www.googleapis.com/auth/gmail.send']
})
console.log(`authorize visting this url: ${url}`)