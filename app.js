import express from "express";
import dotenv from 'dotenv';
import mysql2 from 'mysql2';
dotenv.config();

const app = express();
const PORT = 3003;
const user = { name: "" };
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

//Main route
app.get('/', (req, res) => {
    res.render('home', { user });
});

//Sends the user to the sign up view
app.get('/signup', (req, res) => {
    res.render('signup', { user });
});

app.get('/profile', (req, res) => {
    res.render('profile', { user });
});

app.get('/signin', (req,res)=>{
    res.render('signin', { user })
})

app.get('/admin', async(req, res) => {

    try {
        const [submissions] = await pool.query('SELECT * FROM cards ORDER BY timestamp DESC');
        res.render('admin', { user,submissions });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders' + err.message)
    }
});


app.post('/signup', async(req, res) => {


    const params=[
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.password
    ]
    const sql = `INSERT INTO users(fname,lname, email,password)
                  values (?,?,?,?);`;

    const result = await pool.execute(sql, params);
    const [count]= await pool.query(`Select COUNT(*) As count FROM users`)


    res.render('confirmation_userform', {
        user,
        formData: req.body,
        submissionCount: count[0].count
    });
});
app.post('/upload', async(req, res) => {

    const { name, category, rate, stat, price, history } = req.body;


    const params = [
        name,
        category,
        rate,
        stat,
        price,
        history,
    ];
    const sql = `INSERT INTO cards(name,category,rate,stat,price,history)
                  values (?,?,?,?,?,?);`;

    const result = await pool.execute(sql, params);
    const [count] = await pool.query(`Select COUNT(*) As count FROM cards`)
    console.log(result)
    res.render('confirmation_upload', {
        user,
        formData: req.body,
        submissionCount: count[0].count
    });

});


app.get('/upload', (req, res) => {
    res.render('upload', { user });
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});