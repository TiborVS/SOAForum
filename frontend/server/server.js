const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const port = process.env.PORT || 4000

app.use(express.static("dist"));

app.listen(port, () => {
    console.log("serving on port " + port);
});
