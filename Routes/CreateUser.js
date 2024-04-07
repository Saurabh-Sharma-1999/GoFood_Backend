const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET;



const validation = [
   body('email', "Email should be valid.").isEmail(),
   body('location', "Location should be valid.").exists(), // Added validation for location
   body("name", "Name has minimum 5 characters.").isLength({min: 5}),
   body('password', "Password should have minimum 5 characters.").isLength({min: 5})
]

router.post("/users", validation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors immediately
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    
    try {
        const user = await new User({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            password: secPassword
        }).save(); // Simplified user creation and saving
        
        console.log(user);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

router.post("/login",
  body('email', "Email should be valid.").isEmail(),
  body('password', "Password should have minimum 5 characters.").isLength({min: 5}), async (req, res) => {
    let email = req.body.email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors immediately
    }
   
    try {
        let userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({ errors: "Email you enter does not exits!"});
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if(!pwdCompare){
            return res.status(400).json({ errors: "Password incorrect!"});
        }
        const data = {
            user:{
                id: userData.id
            }
        }
        const authToken = jwt.sign(data, jwtSecret, { expiresIn: '1h' })
        return res.json({ success: true, authToken: authToken});
       
      
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports = router;
