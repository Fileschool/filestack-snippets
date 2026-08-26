const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  setTimeout(() => {
    res.send('File uploaded');
  }, 2000); // simulate delay
});

app.listen(5000, () => console.log('Server running on port 5000'));