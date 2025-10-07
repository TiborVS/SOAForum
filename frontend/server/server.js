const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require('path');

dotenv.config();

const port = process.env.PORT || 4000

app.use(express.static("dist"));

const indexHtml = path.resolve(__dirname, "./dist/index.html");
app.use("*", (req, res) => {
    res.sendFile(indexHtml)
})


app.listen(port, () => {
    console.log("serving on port " + port);
});
