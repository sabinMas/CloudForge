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

// Main route renders the home page

app.get('/', (req, res) => {
    res.render('home', { user });
});

// Sign-up page route renders the signup form for new users

app.get('/signup', (req, res) => {
    res.render('signup', { user });
});

// Profile page route renders the user profile page

app.get('/profile', (req, res) => {
    res.render('profile', { user });
});

// Sign-in page route renders the login form

app.get('/signin', (req,res)=>{
    res.render('signin', { user, error:false })
})

// Sign-in submission route
// Checks user credentials against the database; redirects to home if successful, shows error if failed

app.post('/signinsubmit',async(req,res)=>{
    try{
        //Used this site as a refrence to write this query properly. https://blogs.oracle.com/mysql/parameterizing-mysql-queries-in-node"
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [req.body.email]
        );
        console.log(users[0].password)
        if(users[0].password===req.body.password){
            res.redirect('/')
        }
        else {
            res.render('signin', {user, error: true})
        }
    }
    catch(err){
        res.status(500).send('Error loading orders' + err.message)
    }
})

// Admin page route
// Fetches all card submissions and all users from the database
//Renders the admin page with two tables: cards and users

app.get('/admin', async(req, res) => {

    try {
        const [submissions] = await pool.query('SELECT * FROM cards ORDER BY timestamp DESC');
        const [users] = await pool.query('SELECT id, fname, lname, email FROM users ORDER BY id');
        res.render('admin', { user,submissions,users });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders' + err.message)
    }
});

// Sign-up form submission route
// Saves a new user to the database

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

// Upload form submission route
// Saves a new card to the database

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

// Upload page route
// Renders the upload form page

app.get('/upload', (req, res) => {
    res.render('upload', { user });
});

// Start server

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});