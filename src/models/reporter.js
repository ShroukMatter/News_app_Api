const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


const reporterSchema = mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    age:{
        type:Number,
        required: false,
        trim: true
    },
    email:{
        type:String,
        unique: true,
        required: true, 
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }

    },
    password:{
        type:String,
        required: true,
        trim: true,
        validate(value){
            let strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")

            if(!strongPassword.test(value)){
                throw new Error("password must include chars..")
            }
        }
    },
    phoneNum:{
        type:Number,
        required: true,
        trim: true,
        validate(value){
            let egyptianNum = new RegExp("^(201|01|00201)[0-2,5]{1}[0-9]{8}")
            if(!egyptianNum.test(value)){
                throw new Error("Only Egyptian numbers are allowed")
            }
        }
    }
    ,
    tokens:[
        {
            type:String,
            required: true
        }
    ],
    avatar:{
        type:Buffer
    }
})

reporterSchema.pre('save', async function(){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcryptjs.hash(reporter.password,8)


})

reporterSchema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporter.findOne({email})
    if(!reporter){
        throw new Error('Please chech email or password')
    }
    const isMatch = await bcryptjs.compare(password, reporter.password)
     
    if(!isMatch){
        throw new Error('Please chech email or password')

    }
    return reporter
}
 reporterSchema.methods.generateToken = async function(){
    const reporter = this

    const token = jwt.sign({_id:reporter._id.toString()},'newstask')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
 }

 ////////////////////////  virtual relation ///////////

 reporterSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'reporter'
 })


///////////////////// sensetiveData ////////////////////


reporterSchema.methods.toJSON = function(){
    const reporter = this 
    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens
    return reporterObject
     
}






const Reporter = mongoose.model('Reporter',reporterSchema)
module.exports = Reporter 