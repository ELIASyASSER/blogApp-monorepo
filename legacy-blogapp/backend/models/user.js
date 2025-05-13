const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'please enter username'],
        min:5,
        unique:[true,'username must be different']
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        
    }
})
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}


module.exports = mongoose.models.User||mongoose.model("User",userSchema) 