const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middelware/auth')
const multer  = require('multer')


//////////////////////////// Sign up ///////////////////////////////////////



router.post('/signup', async (req,res) => {
    try{
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
   catch(err){
        res.status(400).send(err.message)}
})

//////////////////////////// Login  ///////////////////////////////////////


router.post('/login',async(req, res) => {
    try{
    const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
    const token = await reporter.generateToken()
    res.status(200).send({reporter,token})}
    catch(err){
        res.status(400).send(err.message)
    }
})


//////////////////////////// Profile ///////////////////////////////////////


router.get('/profile',auth,async(req, res) => {
    res.status(200).send(req.reporter)
})




//////////////////////////// Update ///////////////////////////////////////


router.patch('/reporter',auth, async (req, res)=> {
    try{
        const reporter = await Reporter.findByIdAndUpdate(req.reporter._id, req.body,{
            new:true,
            runValidators:true
        })
        if(!reporter){
            res.status(404).send('No reporter found')
        }
        res.status(200).send(reporter)

    }
    catch(e){
        res.status(400).send(e.message)
    }
})


//////////////////////////// Delete ///////////////////////////////////////



router.delete('/reporter',auth, async (req, res) => {
    try{
        const reporter = await Reporter.findByIdAndDelete(req.reporter._id)
        if(!reporter){
        res.status(404).send('No reporter found')

    }
    res.status(200).send(reporter)

    }
    catch(e){
        res.status(400).send(e.message)
    }
    
})


/////////////////////////////// upload img /////////////////////////////////

const upload = multer({
    limits:{
        fileSize:1000000,

    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(null,true)

    }
})

router.post('/profileimg', auth , upload.single('img'),async (req, res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send()

    }
    catch(e){
        res.status(400).send(e)
    }
})


router.delete('/logout', auth , async (req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((token) =>{
            return token !== req.token
        })

         await req.reporter.save()
         res.status(200).send()

    }
    catch(e){
res.status(500).send(e)
    }
})


//////////////////// logout all

router.delete('/logoutall',auth, async (req, res)=>{
    try{
        req.reporter.tokens =[]
        await req.reporter.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }

})

















module.exports = router