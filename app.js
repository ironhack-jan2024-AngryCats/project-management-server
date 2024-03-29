require("dotenv/config");
const express = require('express');
const mongoose = require("mongoose");
 
// Create an express server instance named `app`
// `app` is the Express server that will be handling requests and responses
const app = express();

// Make the static files inside of the `public/` folder publicly accessible
app.use(express.static('public'));

// Configure Express to be able to read incoming HTTP request that contain JSON data in the body.
app.use(express.json());


// Connect to DB
mongoose
    .connect("mongodb://127.0.0.1:27017/project-management-server")
    .then((response) => {
        console.log(`Connected! Database Name: "${response.connections[0].name}"`);
    })
    .catch((err) => console.error("Error connecting to Mongo", err));



app.use("/auth", require("./routes/auth.routes"));
app.use("/", require("./routes/project.routes"));
app.use("/", require("./routes/task.routes"));


const PORT = process.env.PORT || 5005;

// Start the server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
