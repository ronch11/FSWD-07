// server.js
const express = require('express');
const fileUpload = require('express-fileupload');

const path = require('path');
const { existsSync } = require('fs');
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const privateKey = fs.readFileSync('security/privateKey.pem', 'utf8');
const certificate = fs.readFileSync('security/certificate.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();

// Configure your app routes and middleware here...

const PORT = 8000;

// const crypto = require('crypto');

// const jwtSecretKey = crypto.randomBytes(64).toString('hex');

// console.log(jwtSecretKey);

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('uploads'));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your client application's URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (e.g., cookies, authorization headers)
    next();
});
app.use(fileUpload());
const usersRouter = require('./routes/users');
const videosRouter = require('./routes/videos');
const commentsRouter = require('./routes/comments');
const historyRouter = require('./routes/history');
const playlistsRouter = require('./routes/playlists');
if (!existsSync(path.join(__dirname, 'dist'))) {
    console.log('Building client files...');
    execSync('cd ' + path.join(__dirname, '../client' + ' && npm run build'));
    console.log('Copying dist folder from client to server...');
    execSync('cp -r ../client/dist .');
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.use('/api/users', usersRouter)
app.use('/api/videos', videosRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/history', historyRouter)
app.use('/api/playlists', playlistsRouter)
app.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
});
// const server = https.createServer(credentials, app);
// server.listen(PORT, () => {
//   console.log('Server is running on PORT:',PORT);
// });

// client code
// import axios from 'axios';

// axios.interceptors.request.use((config) => {
//   // Assuming your token is stored in localStorage
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }

//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });