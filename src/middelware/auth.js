const jwt = require('jsonwebtoken')
const Reporter=require('../models/reporter')



const auth  = async(req, res, next) => {
    try{ 
        const token = req.header('Authorization').replace('Bearer ','')
        const decodedToken = jwt.verify(token,'newstask')
        const reporter = await Reporter.findOne({_id:decodedToken._id,tokens:token })

        if(!reporter){  
            throw new Error()
        }
        req.reporter = reporter
        next()

    }
    catch(err){
        res.status(401).send({error:'Please authenticate'})
    }
}      

module.exports = auth