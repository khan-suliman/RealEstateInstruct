const Course = require("./../models/courses")
const { encodeMsg, decodeMsg } = require("../helper/createMsg");
const Chapters = require("./../models/chapters")
const fs = require("fs")
// chpaters detail
const chapterDetail = async (req, res) => {
    // const allChaptersDetails = Chapters.find()
    var msgToken = req.query.msg;
    var option = {}
    if (msgToken) {
        var msg = decodeMsg(msgToken)
        option = msg
    }
    const chapters = await Chapters.find().populate("course")
    res.render("dashboard/examples/chapter/chapter-details", {
        title: "Dashboard | Chapters Detail",
        chapters,
        toast: Object.keys(option).length == 0 ? undefined : option
    })
}

// addChapter get
const addChapter = async (req, res) => {
    try {
        var msgToken = req.query.msg;
        var option = {}
        if (msgToken) {
            var msg = decodeMsg(msgToken)
            option = msg
        }
        const courses = await Course.find({status:"publish"})
        res.render("dashboard/examples/chapter/add-chapter", {
            courses,
            title: "Dashboard | Add Chapter",
            toast: Object.keys(option).length == 0 ? undefined : option
        })
    } catch (e) {
        res.status(501).json({
            status: 501,
            error: e.message
        })
    }
}
// add Chapter post
const postChapter = async (req, res) => {
    try {
        const data = await req.body
        const fileName = 'uploaded-media/' + req.file.filename
        const courseId = await Course.findOne({ name: data.course })
        const chapterAdded = Chapters({
            name: data.name,
            fileName: req.file.originalname,
            path: fileName,
            course: courseId._id
        })
        await chapterAdded.save()
        var msg = encodeMsg("Your Chapter has been added")
        return res.redirect('/dashboard?msg=' + msg)

        // const courses = await Courses.find()

        // res.render("dashboard/examples/add-chapter", {
        //     courses,
        //     title:"Dashboard | Add Course"
        // })
        // for post man
        // res.json({
        //     status:chapterAdded
        // })
    } catch (e) {
        var msg = encodeMsg("Your course has been added")
        return res.redirect('/dashboard?msg=' + msg)
        // postman
        // res.status(501).json({
        //     error: e.message
        // })
    }
}

// Chapter Delete
const deleteChapter = async (req, res) => {
    try {
        const id = await req.query.cId
        const chapter = await Chapters.findById(id)
        await chapter.remove()
        fs.unlink("public/" + chapter.path, (err, data) => {
        })
        var msg = encodeMsg("Chapter Deleted",type='danger', status = 404)
        res.redirect("/dashboard/chapter-detail?msg="+msg)
        // const chapterData = 
    } catch (e) {
        res.render("500.hbs")
    }
}
// edit chapter
const editChapter = async (req, res) => {
    try {
        let chapterId = req.query.cId
        const chapter = await Chapters.findById(chapterId).populate("course")
        const courses = await Course.find()
        res.render("dashboard/examples/chapter/edit-chapter", {
            courses,
            title: "Dashboard | Edit Chapter",
        })
    } catch (e) {
        res.status(503).json({
            msg: e.message,
            status: 503
        })
    }
}
// update
const updateChapter = async (req, res) => {
    try {
        const data = req.body
        const chapter = await Chapters.findById(req.query.cId)
        const courseId = await Course.findOne({ name: data.course })
        if (req.file) {
            const filePath = 'uploaded-media/' + req.file.filename
            const oldPath = chapter.path
            await chapter.updateOne({
                name: req.body.name,
                course: courseId._id,
                fileName: req.file.originalname,
                path: filePath,
            })
            fs.unlink("public/" + oldPath, (err, data) => {
                console.log("delte", err, data)
            })
            var msg = encodeMsg("Chapter Updated")
            return res.redirect("/dashboard/chapter-detail?msg="+msg)
        }
        await chapter.updateOne({
            name: req.body.name,
            course: courseId._id,
        })
        var msg = encodeMsg("Chapter Updated")
        res.redirect("/dashboard/chapter-detail?msg="+msg)
    } catch (e) {
        res.status(404).json({
            err: e.message,
            status: 404
        })
    }
}


// error msg
const errorMsg = async (error, req, res, next) => {
    var msg = await encodeMsg(error.message, "danger", 500)
    res.redirect('/dashboard/add-chapter?msg=' + msg)
    // for postman
    // res.status(404).json({
    //     err: error.message
    // })
}


module.exports = { addChapter, chapterDetail, postChapter, errorMsg, deleteChapter, editChapter, updateChapter }