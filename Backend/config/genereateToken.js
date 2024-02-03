const jwt = require('jsonwebtoken')

exports.generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "30d",
    })
}

exports.generateResetToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expireIn: "10m",
    })
}
