const express = require('express');
const mongoose = require("mongoose");

const Project = require("./models/Project.model");
 
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




// POST /projects
app.post("/projects", (req, res, next) => {

    const {title, description} = req.body;

    Project.create({title, description})
        .then( (projectFromDB) => {
            res.status(201).json(projectFromDB)
        })
        .catch( (e) => {
            console.log("Error creating a new project");
            console.log(e)
            res.status(500).json({message: "Error creating a new project"})
        });
});



// GET /projects
app.get("/projects", (req, res, next) => {
    Project.find()
        .then( (projectsFromDB) => {
            res.json(projectsFromDB);
        })
        .catch( (e) => {
            console.log("Error getting list of projects");
            console.log(e)
            res.status(500).json({message: "Error getting list of projects"})
        });
});



// GET /projects/:projectTitle 
app.get("/projects/:projectTitle", (req, res, next) => {
    const {projectTitle} = req.params;

    Project.findOne({title: projectTitle})
        .then( (projectDetails) => {
            res.json(projectDetails);
        })
        .catch( (e) => {
            console.log("Error getting project details");
            console.log(e)
            res.status(500).json({message: "Error getting project details"})
        });
})




// Start the server
app.listen(3000, () => console.log("My first app listening on port 3000! "));