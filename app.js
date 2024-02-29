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



app.use("/", require("./routes/project.routes"));




// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000! "));