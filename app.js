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

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
        cb(null, uniqueName);
    }
});

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
    secret: 'key',
    resave: false,
    saveUninitialized: true
}));

// FIX: was `{ user, cards }` — `user` was undefined (not `req.session.user`)
app.get('/', async (req, res) => {
    try {
        const [cards] = await pool.query('SELECT * FROM cards ORDER BY RAND() LIMIT 10');
        res.render('home', { user: req.session.user, cards });
    } catch (err) {
        console.error(err);
        res.render('home', { user: req.session.user, cards: [] });
    }
});

app.get('/signout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/signup', (req, res) => {
    res.render('signup', { user: req.session.user, errors: null });
});

// now queries the DB for cards belonging to the logged-in user
app.get('/profile', async (req, res) => {
    try {
        let userCards = [];
        if (req.session.user) {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE email = ? LIMIT 1',
                [req.session.user.email]
            );
            if (rows.length > 0) {
                const userId = rows[0].id;
                const [cards] = await pool.query(
                    'SELECT * FROM cards WHERE user_id = ? ORDER BY timestamp DESC',
                    [userId]
                );
                userCards = cards;
            }
        }
        res.render('profile', { user: req.session.user, userCards });
    } catch (err) {
        console.error(err);
        res.render('profile', { user: req.session.user, userCards: [] });
    }
});

app.get('/signin', (req, res) => {
    res.render('signin', { user: req.session.user, error: false });
});

app.post('/signinsubmit', async (req, res) => {
    try {
        if (req.body.email == '' || req.body.password == '') {
            res.render('signin', { user: req.session.user, error: true });
            return;
        }
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [req.body.email]
        );
        if (users.length > 0 && users[0].password === req.body.password) {
            const returnUser = {
                "id": users[0].id,
                "fname": users[0].fname,
                "lname": users[0].lname,
                "email": users[0].email
            };
            req.session.user = returnUser;
            res.redirect('/profile');
        } else {
            res.render('signin', { user: req.session.user, error: true });
        }
    } catch (err) {
        res.status(500).send('Error signing in: ' + err.message);
    }
});

// FIX: was `{ user, submissions, users }` — `user` was undefined
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

app.post('/signup', async (req, res) => {
    const valid = validate_signup(req.body);
    if (!valid.isValid) {
        res.render('signup', { user: req.session.user, errors: valid.errors });
        return;
    }
    const params = [req.body.fname, req.body.lname, req.body.email, req.body.password];
    const sql = `INSERT INTO users(fname, lname, email, password) VALUES (?, ?, ?, ?)`;
    await pool.execute(sql, params);
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM users`);
    res.render('confirmation_userform', {
        user: req.session.user,
        formData: req.body,
        submissionCount: count[0].count
    });
});

// FIX: now saves user_id (from session) so cards are tied to the uploader
app.post('/upload', upload.single('imgUpload'), async (req, res) => {
    const { name, category, rate, stat, price, history } = req.body;
    const valid = validate_upload(req.body);
    if (!valid.isValid) {
        res.render('upload', { user: req.session.user, errors: valid.errors });
        return;
    }
    const image = req.file ? req.file.filename : null;
    // Pull user_id from session if logged in, otherwise null
    const userId = req.session.user ? req.session.user.id : null;

    const params = [name, category, rate, stat, price, history, image, userId];
    const sql = `INSERT INTO cards(name, category, rate, stat, price, history, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, params);
    const [count] = await pool.query(`SELECT COUNT(*) AS count FROM cards`);

    res.render('confirmation_upload', {
        user: req.session.user,
        formData: req.body,
        submissionCount: count[0].count,
        image
    });
});

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

app.get('/upload', (req, res) => {
    res.render('upload', { user: req.session.user, errors: null });
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});