const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require('../db')
const { Course } = require('../db')

// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    const userexist = await User.findOne({username:username, password:password});
    if(userexist){
        res.status(403).json({
            message : "User already exist"
        })
    }
    else{
        await User.create({
            username : username,
            password : password
        })
        res.json({
            message : "User Created succesfully"
        })
    }
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const list = await Course.find({});
    res.json({
        courses : list
    })
});

router.post('/courses/:courseId', userMiddleware,async(req, res) => {
    // Implement course purchase logic
    const courseid = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username : username
    },{
        "$push":{
            purchasedCourses : courseid
        }
    })
    res.json({
        message : "Purchase complete"
    })
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic

    const hello = await User.findOne({ 
        username : req.headers.username
    });
    const course = await Course.find({
        _id : {
            "$in" : hello.purchasedCourses
        }
    });

    res.json({
        Purchased_courses : course
    })
});

module.exports = router