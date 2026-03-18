import express from "express";
import dotenv from 'dotenv';
import mysql2 from 'mysql2';
import multer from 'multer';
import path from 'path';
import session from "express-session";
import { validate_upload, validate_signup } from "./validate.js";
dotenv.config();


const app = express();
const PORT = 3003;
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Multer storage config — saves files to /public/uploads/
// Each file gets a unique name using the current timestamp
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, uniqueName);
    }
});

// Only allow image file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ storage, fileFilter });

app.set("view engine", 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:'key',
    resave:false,
    saveUninitialized:true
}));

// Auth middleware — redirects unauthenticated users to /signin
// Saves the original URL so we can redirect back after sign-in
function requireLogin(req, res, next) {
    if (req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/signin');
}

// Main route renders the home page
app.get('/', async (req, res) => {
    try {
        const [cards] = await pool.query('SELECT * FROM cards ORDER BY RAND() LIMIT 10');
        res.render('home', { user: req.session.user, cards });
    } catch (err) {
        console.error(err);
        res.render('home', { user: req.session.user, cards: [] });
    }
});

app.get('/signout', (req,res)=>{
    req.session.destroy();
    res.redirect('/')
});

// Sign-up page route
app.get('/signup', (req, res) => {
    res.render('signup', { user: req.session.user, errors:null });
});

// Profile page route — requireLogin ensures only logged-in users can access it
app.get('/profile', requireLogin, async (req, res) => {
    try {
        const [cards] = await pool.query(
            'SELECT * FROM cards WHERE user_id = ? ORDER BY timestamp DESC',
            [req.session.user.id]
        );
        res.render('profile', { user: req.session.user, userCards: cards });
    } catch (err) {
        console.error(err);
        res.render('profile', { user: req.session.user, userCards: [] });
    }
});

// Sign-in page route
app.get('/signin', (req, res) => {
    res.render('signin', { user: req.session.user, error: false });
});

// Sign-in submission route
app.post('/signinsubmit', async (req, res) => {
    try {
        if(req.body.email==''||req.body.password==''){
            res.render('signin', { user: req.session.user, error:true })
            return;
        }
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [req.body.email]
        );
        if (users.length > 0 && users[0].password === req.body.password) {
            const returnUser={
                "id":    users[0].id,
                "fname": users[0].fname,
                "lname": users[0].lname,
                "email": users[0].email
            }
            req.session.user = returnUser;
            // Redirect back to whatever page they were trying to reach (e.g. /upload)
            const returnTo = req.session.returnTo || '/profile';
            delete req.session.returnTo;
            res.redirect(returnTo);
        } else {
            res.render('signin', { user: req.session.user, error: true });
        }
    } catch (err) {
        res.status(500).send('Error loading orders' + err.message);
    }
});

// Admin page route
app.get('/admin', async (req, res) => {
    try {
        const [submissions] = await pool.query('SELECT * FROM cards ORDER BY timestamp DESC');
        const [users] = await pool.query('SELECT id, fname, lname, email FROM users ORDER BY id');
        res.render('admin', { user: req.session.user, submissions, users });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders' + err.message);
    }
});

// Sign-up form submission route
app.post('/signup', async (req, res) => {
    const params = [
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.password
    ];
    const valid=validate_signup(req.body)
    if(!valid.isValid){
        res.render('signup', { user: req.session.user, errors:valid.errors})
        return;
    }
    const sql = `INSERT INTO users(fname, lname, email, password) VALUES (?, ?, ?, ?)`;
    const result = await pool.execute(sql, params);
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM users`);
    res.render('confirmation_userform', {
        user: req.session.user,
        formData: req.body,
        submissionCount: count[0].count
    });
});

// Upload page route — requireLogin ensures only logged-in users can access it
app.get('/upload', requireLogin, (req, res) => {
    res.render('upload', { user: req.session.user, errors: null });
});

// Upload form submission route
// upload.single('imgUpload') matches the name="imgUpload" on the file input in upload.ejs
// requireLogin ensures user_id is always present — no more nullable uploads
app.post('/upload', requireLogin, upload.single('imgUpload'), async (req, res) => {
    const { name, category, rate, stat, price, history } = req.body;
    //validates upload page
    const valid = validate_upload(req.body)
    if (!valid.isValid) {
        res.render('upload', { user: req.session.user, errors: valid.errors })
        return;
    }
    // If a file was uploaded use its filename, otherwise store null
    const image = req.file ? req.file.filename : null;
    // Pull user_id from session — guaranteed non-null by requireLogin
    const userId = req.session.user.id;

    const params = [name, category, rate, stat, price, history, image, userId];
    const sql = `INSERT INTO cards(name, category, rate, stat, price, history, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await pool.execute(sql, params);
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM cards`);

    res.render('confirmation_upload', {
        user: req.session.user,
        formData: req.body,
        submissionCount: count[0].count,
        image
    });
});

// Cards browse page — supports ?category= filter from home page
app.get('/cards', async (req, res) => {
    try {
        const category = req.query.category || 'all';
        const [submissions] = await pool.query('SELECT * FROM cards ORDER BY timestamp DESC');
        res.render('cards', { user: req.session.user, submissions, activeCategory: category });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading cards: ' + err.message);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
