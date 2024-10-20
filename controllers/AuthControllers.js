const User = require('../models/User')
const bcrypt = require('bcryptjs')
const flash = require('express-flash')

module.exports = class AuthControllers {

    static async Login(req, res) {

        res.render('auth/login')
    }

    static async LoginPost(req, res) {
        const { email, password } = req.body

        // console.log(email)
        const user = await User.findOne({ where: { email: email } })
        // console.log(user)

        if (!user) {
            req.flash('message', 'Usuário não existe!')
            res.render('auth/login')
            return
        }


        const CheckPassword = bcrypt.compareSync(password, user.password)

        if (!CheckPassword) {
            req.flash('message', 'Senha errada!')
            res.render('auth/login')
            return
        }


        req.session.userid = user.id
        req.flash('message', 'Bem vindo de volta!')

        req.session.save(() => {
            res.redirect('/')
        })


    }

    static Register(req, res) {
        res.render('auth/Register')
    }

    static async RegisterPost(req, res) {
        const { name, email, password, confirmpassword } = req.body
        console.log(email)
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem.')
            res.render('auth/Register')
            return
        }

        const CheckIfUserExist = await User.findOne({ where: { email: email } })

        if (CheckIfUserExist) {
            req.flash('message', 'Usuário ja existe')
            res.render('auth/Register')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const HashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: HashedPassword
        }

        try {
            const CreatedUser = await User.create(user)
            req.flash('Message', 'Cadastro realizado')

            req.session.userid = CreatedUser.id


            req.session.save(() => {
                res.redirect('/')
            })

        } catch (error) {
            console.log(error)
        }

    }
    static Logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}