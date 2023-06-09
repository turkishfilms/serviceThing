/**  
 dependencies
 fx to get drive data
 fx notify late ones
 have a timer for once a day
 once a day do thing
 lates = get data ( lates)
 notify(lates) 
 */

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const res = await drive.files.list({
        fields: 'nextPageToken, files(id, name)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });
    const files = res.data.files;
    if (files.length === 0) {
        console.log('No files found.');
        return;
    }

    console.log('Files:');
    files.map((file) => {
        console.log(`${file.name} (${file.id})`);
    });
}

/**
 * Lists the names of shared drives.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listDrives(authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const res = await drive.drives.list();
    const drives = res.data.drives;
    console.log(res)
    fs.appendFile('response.json',JSON.stringify(res))
    if (drives.length === 0) {
        console.log('No drives found.');
        return;
    }

    console.log('drives:');
    drives.map((drive) => {
        console.log(`${drive.name} (${drive.id})`);
    });
}

/**
 * Lists the names of shared drives.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function fileToCSV(authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const res = await drive.files.export({
        fileId:"1BVYz9OdXlJA3ZsXegsBp8CbEi7ftRoF6LmBnRt0EKCE",
        mimeType: "text/csv"
    });
    const csv = res.data;
    console.log(res)
    fs.appendFile('daycare.csv',JSON.stringify(csv))

    console.log('drives:', csv);
  
}

// authorize().then(fileToCSV).catch(console.error);
const sendmail = require('sendmail')();
 
sendmail({
    from: 'ddrbnsn@gmail.com',
    to: 'ddrbnsn@gmail.com ',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
