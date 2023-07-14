import { google } from 'googleapis'
import credentials from '../../OAUTH2_Credentials.json' assert {type: 'json'};
import token from '../../credentials/token.json' assert {type: 'json'};
import cron from 'node-cron'

function gmailService() {
    const { client_secret, client_id, redirect_uris } = credentials.web
    const OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    OAuth2Client.setCredentials(token)
    const gmail = google.gmail({
        version: 'v1',
        auth: OAuth2Client
    })
    return gmail
}


function makeBody(to, from, subject, body) {
    const str = [
        "Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        body
    ].join("")
    return new Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

async function sendMail(body) {
    const raw = makeBody(body.to, body.from, body.subject, body.body)
    const gmail = gmailService()
    const { data: { id } } = await gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw 
        },
    });
    console.log(id)
}

function scheduleMailSend({ sec, min, hour, day, month = '*', stepSec, stepMin, stepHour, stepDay }, mailObject) {
    const cron_sec = sec ? sec : stepSec ? `*/${stepSec}` : '0'
    const cron_min = min ? min : stepMin ? `*/${stepMin}` : '*'
    const cron_hour = hour ? hour : stepHour ? `*/${stepHour}` : '*'
    const cron_day = day ? day : stepDay ? `*/${stepDay}` : '*'
    cron.schedule(`${cron_sec} ${cron_min} ${cron_hour} ${cron_day} ${month} *`, () => {
        sendMail(mailObject)
    })
}

//stucture of schedul object

//step properties are for when you want to send email per sec , min, hour ..etc.

// const schedule={
//     sec:0,
//     min:0,
//     hour:0,
//     day:0,
//     month:0,
//     stepSec:0,
//     stepMin:0,
//     stepHour:0,
//     stepDay:0
// }


//structure of mailobject
// const mailobject={
//     to:'sending email',
//     from:'your email',
//     subject:'subject',
//     body:'body'
// }

//this schedule is to send mail every hour
const schedule = {
    stepHour: 1,
}
//this schedult is to send the mail at 8:30 pm 
const perticulerSchedule={
    sec:0,
    min:30,
    hour:20,
}

const mailobject = {
    to: 'iamsoumo2004@gmail.com',
    from: 'iamsoumo26@gmail.com',
    subject: 'test subject',
    body: 'test body'
}


scheduleMailSend(schedule,mailobject)