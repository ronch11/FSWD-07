// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const PORT = 8000;

app.use(fileUpload());

app.post('/upload', (req, res) => {  
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const videoFile = req.files.video;

  const uploadPath = __dirname + '/uploads/' + videoFile.name; //adjust the path as needed

  videoFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('File uploaded to ' + uploadPath);
    res.send('File uploaded to ' + uploadPath);
  });
});


app.post('/login', (req, res) => {
    // User verification goes here...
    // If user is validated,
    const user = { id: 123 }; // This usually would be a user object
    const accessToken = jwt.sign(user, 'your_secret_key', { expiresIn: '1h' }); // Create JWT token with user data and secret key
    res.json({ accessToken }); // Send the token to the client
  });
  
app.listen(PORT, () => {
  console.log('Server is running on PORT:',PORT);
});