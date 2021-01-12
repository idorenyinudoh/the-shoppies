const express = require('express');
const app = express();
const port = 3000;

app.listen(process.env.PORT || port, () => {
    console.log(`Express app running at http://localhost:${port}`);
});