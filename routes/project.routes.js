const router = require('express').Router();
const Project = require("../models/Project.model");


// POST /projects
router.post("/projects", (req, res, next) => {

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
router.get("/projects", (req, res, next) => {
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
router.get("/projects/:projectTitle", (req, res, next) => {
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


module.exports = router;