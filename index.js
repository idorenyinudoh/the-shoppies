const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('./public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(process.env.PORT || port, () => {
    console.log(`Express app running at http://localhost:${port}`);
});