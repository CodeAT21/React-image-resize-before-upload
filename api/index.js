const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const port = process.env.PORT || 8080;

// Databse Connection
const connection = require('./config/database');

app.use(cors());

const storage = multer.diskStorage({
	destination: path.join(__dirname, '../public_html/', 'uploads'),
	filename: function (req, file, cb) {   
		// null as first argument means no error
		cb(null, Date.now() + '-' + file.originalname )
	}
})

app.post('/imageupload', async (req, res) => {	
	try {
		// 'avatar' is the name of our file input field in the HTML form
		let upload = multer({ storage: storage}).single('avatar');
		upload(req, res, function(err) {
			if (!req.file) {
				return res.send('Please select an image to upload');
			}else if (err instanceof multer.MulterError) {
				return res.send(err);
			}else if (err) {
				return res.send(err);
			}

			const imageResize = {
				image: req.file.filename
			}
			const sql = "INSERT INTO posts SET ?";
			connection.query(sql, imageResize, (err, results) => {  if (err) throw err;
				res.json({ success: 1 })    
			});
		});

	} catch (err) {console.log(err)}
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))