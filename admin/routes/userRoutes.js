const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.post('/login', async (req, res)=>{
    const {email, password} = req.body || {}
    if (!email || !password){
        return res.status(400).json({message:"Email or password cannot be empty"})
    }
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({
            message: "Invalid email or password"
        })
        if (user.password === password){
            const token = 'token-' + Date.now() + '-' + Math.random().toString(36).slice(2)
            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.username,
                    email: user.email
                },
                token
            })
        } else {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
})

router.post('/signup', async (req, res)=>{
    const {username, email, password} = req.body || {}
    if (!username || !email || !password){
        return res.status(400).json({message:"Please fill all the required fields"})
    }
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({
            message: "Email already taken. Please try again with different email-id or try logging in with the same email"
        })
        
        const newUser = new User({ username, email, password })
        await newUser.save()
        
        const token = 'token-' + Date.now() + '-' + Math.random().toString(36).slice(2)
        res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.username,
                email: newUser.email
            },
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports = router