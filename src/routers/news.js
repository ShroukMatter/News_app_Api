const express = require('express');
const router= express.Router()
const News= require('../models/news')
const auth = require('../middelware/auth')
const multer = require('multer')




router.post('/news',auth,(req, res) =>{
const news = new News({...req.body,reporter:req.reporter._id})
    news.save().then(() =>{
        res.status(200).send(news)
    }).catch(e=>{
        res.status(400).send(e)
    }) 
})

//////////////////////////// Get news ///////////////////////////////////////

router.get('/news',auth, async (req, res)=> {
    try{
        await req.reporter.populate('news')
        res.status(200).send(req.reporter.news) 

    }
    catch(e){
        res.status(500).send(e.message)
    }
})


//////////////////////////// Update ///////////////////////////////////////


router.patch('/news/:id',auth, async (req, res)=> {
    try{
        const _id = req.params.id

        const news = await News.findOneAndUpdate({_id,reporter:req.reporter._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!news){
        return res.status(404).send('No news found')

    }
    res.status(200).send(news)

    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//////////////////////////// Delete ///////////////////////////////////////



router.delete('/news/:id',auth, async (req, res) => {
    try{
        const _id = req.params.id

        const news = await News.findOneAndDelete({_id,reporter:req.reporter._id})
        if(!news){
        return res.status(404).send('No news found')

    }
    res.status(200).send(news)

    }
    catch(e){
        res.status(400).send(e.message)
    }
    
})

//////////////////////////////// upload images //////////////////////

const upload = multer({
    limits: {
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(! file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('plese upload an img'))
        }
        cb(null,true)
    }
})

router.post('/images', auth ,upload.single('image'),async (req, res)=>{
    try{
       const _id = "62e2c9591a3adab8c40255ec"
        const news = await News.findOne({_id,reporter:req.reporter._id})
        news.img = req.file.buffer
        await news.save()
        res.send('Img uploaded successfully')

    }
    catch(e){
        res.status(400).send(e.message)

    }
})






module.exports = router