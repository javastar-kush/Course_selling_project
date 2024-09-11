const express = require("express");
const adminMiddleware = require("../middleware/admin");
const router = express.Router();
const { Admin } = require('../db')
const { Course } = require('../db')


// Admin Routes
router.use(express.json())
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const adminexist = await Admin.findOne({
        username : username,
        password : password
    })
    if(adminexist){
        res.status(403).json({
            message : "admin already exist"
        })
    }
    else{
        await Admin.create({
            username : username,
            password : password
        })
        res.json({
            message : "Admin created successfully"
        })
    }
    
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description =  req.body.description;
    const imagelink =  req.body.imagelink;
    const price = req.body.price;

    const newcourse = await Course.create({
        title : title,
        description : description,
        imagelink : imagelink,
        price : price
    })
    res.json({
        message  : "course created succesfully",
        id : newcourse._id
    })

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const list = await Course.find({})
    res.json({
        Courses : list
    })
});

module.exports = router;