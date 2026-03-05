import express from "express";

const app = express();
const PORT = 3003;
const user = { name: "" };
const submissions = [];

app.set("view engine", 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home', { user });
});

app.get('/signup', (req, res) => {
    res.render('signup', { user });
});


app.post('/signup', (req, res) => {
    const { fname, lname, email } = req.body;

    const record = {
        fname,
        lname,
        email,
        timestamp: new Date().toLocaleString()
    };

    submissions.push(record);

    res.render('confirmation_userform', {
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