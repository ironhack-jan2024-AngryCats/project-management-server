const router = require('express').Router();

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

const {isAuthenticated} = require("../middleware/jwt.middleware");



// POST /tasks
router.post("/tasks", isAuthenticated, async (req, res, next) => {

    const { title, description, projectId } = req.body;

    const newTask = {
        title,
        description,
        project: projectId
    }

    try {
        const taskFromDB = await Task.create(newTask);
        const projectFromDB = await Project.findByIdAndUpdate(projectId, {$push: {tasks: taskFromDB._id}});
        res.status(201).json(taskFromDB);
    } catch(e){
        console.log("Error creating new task");
        console.log(e);
        res.status(500).json({message: "Error creating new task"});
    }

});


module.exports = router;