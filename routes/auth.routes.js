const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/User.model');

const saltRounds = 10;



// POST /auth/signup
router.post("/signup", (req, res, next) => {
    const { email, password, name } = req.body;

    // Check if the email or password or name is provided as an empty string 
    if (email === '' || password === '' || name === '') {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    // check if user exists already 
    User.findOne({email})
        .then( (foundUser) => {

            // if user already exists
            if(foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }

            // create salt
            const salt = bcrypt.genSaltSync(saltRounds);

            // create hash
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create a new user in the database
            return User.create({ email, password: hashedPassword, name })
        })
        .then( (createdUser) => {
            const {email, name, _id} = createdUser;

            const user = { email, name, _id };

            res.status(201).json({user: user});
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" })
        });

});


module.exports = router;