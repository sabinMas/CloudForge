import express from "express";
import dotenv from 'dotenv';
import mysql2 from 'mysql2';
dotenv.config();

const app = express();
const PORT = 3003;
const user = { name: "" };
const submissions = [];
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

app.set("view engine", 'ejs');

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home', { user });
});

app.get('/signup', (req, res) => {
    res.render('signup', { user });
});

app.get('/admin', (req, res) => {
    res.render('admin', { user, submissions });
});

app.post('/signup', async(req, res) => {


    const user = req.body;
    const params=[
        user.fname,
        user.lname,
        user.email,
        user.password
    ]
    console.log(params)
    const sql = `INSERT INTO users(fname,lname, email,password)
                  values (?,?,?,?);`;

    const result = await pool.execute(sql, params);
    const [count]= await pool.query(`Select COUNT(*) As count FROM users`)


    res.render('confirmation_userform', {
        user,
        formData: result,
        submissionCount: count[0].count
    });
});
app.post('/upload', (req, res) => {

    const { name, category, rate, stat, price, history } = req.body;

    const record = {
        name,
        category,
        rate,
        stat,
        price,
        history,
        timestamp: new Date().toLocaleString()
    };

    submissions.push(record);

    res.render('confirmation_upload', {
        user,
        formData: record,
        submissionCount: submissions.length
    });

});


app.get('/upload', (req, res) => {
    res.render('upload', { user });
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});