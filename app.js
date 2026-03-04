import express from "express";

const app = express();
const PORT = 3003;
const user={
    name:""
}
//Set the view engine
app.set("view engine", 'ejs');

app.use(express.static('public'))

app.get('/', (req, res) => {

    res.render(`home`, { user });
})

app.get('/signup',(req,res) => {
    res.render('signup', { user })
});
app.get('/upload', (req, res) => {
    res.render('upload', {user})
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})