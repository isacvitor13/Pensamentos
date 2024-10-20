const express = require('express')
const router = express.Router()
const ToughtControllers = require("../controllers/ToughtController.js")
const CheckAuth = require('../helpers/auth.js').CheckAuth

router.get('/dashboard', CheckAuth, ToughtControllers.Dashboard)
router.post('/remove',ToughtControllers.Remove)
router.get('/edit/:id',CheckAuth,ToughtControllers.UpdateTought)
router.post('/edit',CheckAuth,ToughtControllers.UpdateToughtPost)
router.get('/add', CheckAuth, ToughtControllers.Create)
router.post('/add', ToughtControllers.CreateSave)
router.get('/', ToughtControllers.ShowToughts)

module.exports = router