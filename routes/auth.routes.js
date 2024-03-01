const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../middleware/jwt.middleware");

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


// POST /auth/login
router.post("/login", (req, res, next) => {

    const { email, password } = req.body;

    // Check if email or password are provided as empty string 
    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }

    // Check the users collection if a user with the same email exists
    User.findOne({ email })
        .then( (foundUser) => {
            
            if(!foundUser){
                // If the user is not found, send an error response
                res.status(401).json({ message: "User not found." })
                return;
            }

            // Compare the provided password with the one saved in the database
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if(passwordCorrect){

                // Deconstruct the user object to omit the password
                const { _id, email, name } = foundUser;

                // Create an object that will be set as the token payload
                const payload = { _id, email, name };


                // Create and sign the token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                );

                // Send the token as the response
                res.json({ authToken: authToken });

            } else {
                res.status(401).json({ message: "Unable to authenticate the user" });
            }

        })
        .catch(e => {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" })
        });

});



// GET  /auth/verify  (used to verify JWT stored on the client)
router.get('/verify', isAuthenticated, (req, res, next) => {

    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);

    // Send back the object with user data
    // previously set as the token payload
    res.json(req.payload);
});


module.exports = router;