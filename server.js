const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });  //handling form data

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'travel_database'
});


// express.static expose the file to public url so that it can be accesed .. 
app.use(express.static(path.join(__dirname, 'public'))); //middleware communication

// ROute for serving html // to call root rout 
app.get('/', (req, res) => {            
    res.sendFile(path.join(__dirname, '/public/contact.html'));
  });

// Route for serving cv.css
app.get('/contact.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/contact.css'));
  });  
// re.body send data get from user to backend
  app.post('/createCV', upload.single('picture'), (req, res) => {
    const { name, cnic, previous, experience } = req.body;
    // const { body: { name, cnic, previous, experience }, file: { filename: picture } } = req;

    const picture = req.file.filename;
    console.log(req.body);

    // Insert the data into the MySQL database
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        const sql = 'INSERT INTO travel (name, cnic, previous, experience, picture) VALUES (?, ?, ?, ?, ?)';
        const values = [name, cnic, previous, experience, picture];

        connection.query(sql, values, (error, results) => {
            connection.release(); 

            if (error) {
                console.error('Error inserting data: ' + error.stack);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.send('Task done successfully!');
        });
    });
});

app.listen(3053, () => {
   console.log('task is running on http://localhost:3053');
});
