const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const zalo = require('./routers/zalo');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render("send");
});
app.use('/zalo', zalo);

app.listen(3000, () => {
    console.log('Server started on port 3000');
})
