import express from "express";

const app = express();
const PORT = 3003;

//Set the view engine
app.set("view engine", 'ejs');

app.use(express.static('public'))

app.get('/', (req, res) => {

    res.render(`home`,);
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})