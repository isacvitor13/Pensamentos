const express = require('express')

const router = express.Router()

const AuthControllers = require('../controllers/AuthControllers')

router.get('/login', AuthControllers.Login)
router.post('/login', AuthControllers.LoginPost)
router.get('/register', AuthControllers.Register)
router.post('/register', AuthControllers.RegisterPost)
router.get('/logout', AuthControllers.Logout)

module.exports = router