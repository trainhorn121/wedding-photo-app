const basicAuth = require('express-basic-auth');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const path = require('path');  // usually at the top of the file with your other requires
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/admin', basicAuth({
    users: { 'admin': 'Boyer' },
    challenge: true,
    unauthorizedResponse: (req) => 'Unauthorized'
}));
app.get('/admin', (req, res) => {
  res.send(`
    <h1>Admin Page</h1>
    <p>Welcome, admin!</p>
    <a href="/">Go back to upload page</a>
  `);
});

app.post('/upload', upload.single('photo'), (req, res) => {
  res.send(`
    <h2>Upload complete!</h2>
    <p><a href="/">Back to Upload Page</a></p>
    <p><a href="/gallery">View Gallery</a></p>
  `);
});

app.get('/gallery', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.send('Unable to load images.');
    const images = files.map(file => `<img src="/uploads/${file}" width="200">`).join('<br>');
    res.send(`<h1>Gallery</h1>${images}<p><a href="/">Back</a></p>`);
  });
});
app.get('/admin', (req, res) => {
  res.send(`
    <h1>Admin Page</h1>
    <p>Welcome, admin! (Password protection not added yet.)</p>
    <a href="/">Go back to upload page</a>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

