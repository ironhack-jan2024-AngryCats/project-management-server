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



// GET /projects/:projectId 
router.get("/projects/:projectId", (req, res, next) => {
    const {projectId} = req.params;

    Project.findById(projectId)
        .then( (projectDetails) => {
            res.json(projectDetails);
        })
        .catch( (e) => {
            console.log("Error getting project details");
            console.log(e)
            res.status(500).json({message: "Error getting project details"})
        });
})


// PUT /projects/:projectId 
router.put("/projects/:projectId", (req, res, next) => {

    const {projectId} = req.params;

    const {title, description} = req.body;

    Project.findByIdAndUpdate(projectId, {title, description}, { new: true })
        .then( (updatedProject) => {
            res.json(updatedProject);
        })
        .catch( (e) => {
            console.log("Error updating project");
            console.log(e)
            res.status(500).json({message: "Error updating project"})
        });

});



// DELETE /projects/:projectId 
router.delete("/projects/:projectId", (req, res, next) => {

    const {projectId} = req.params;

    Project.findByIdAndDelete(projectId)
        .then( () => {
            res.json({ message: `Project with ${projectId} is removed successfully.` })
        })
        .catch( (e) => {
            console.log("Error deleting project");
            console.log(e)
            res.status(500).json({message: "Error deleting project"})
        });
});



module.exports = router;