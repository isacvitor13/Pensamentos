const { raw } = require('mysql2')
const Toughts = require('../models/Tought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ToughtControllers {
    static async ShowToughts(req, res) {
        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'

        } else {
            order = 'DESC'
        }


        const toughtsData = await Toughts.findAll({
            include: User,
            where: { title: { [Op.like]: `%${search}%` } },
            order: [['createdAt', order]]
        })


        const toughts = toughtsData.map((result) => result.get({ plain: true }))

        let toughtsQty = toughts.length

        if (toughtsQty === 0) {
            toughtsQty = false
        }
        res.render('toughts/home', { toughts, search, toughtsQty })
    }
    static async Dashboard(req, res) {
        const UserId = req.session.userid

        const user = await User.findOne(
            {
                where: {
                    id: UserId
                },
                include: Toughts,
                plain: true,
            }
        )

        if (!user) {
            res.redirect('/login')
        }
        // console.log(user)
        const toughts = user.Toughts.map((Tought) => Tought.dataValues)

        let emptyToughts = false

        if (toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static Create(req, res) {
        res.render('toughts/create')
    }

    static async CreateSave(req, res) {
        const toughts = {
            title: req.body.title,
            UserId: req.session.userid
        }
        try {
            await Toughts.create(toughts)
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um erro' + error)
        }


    }

    static async Remove(req, res) {
        const id = req.body.id
        const userid = req.session.userid

        try {
            await Toughts.destroy({
                where: {
                    id: id,
                    UserId: userid
                }
            })

            req.flash('message', 'Pensamento removido!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }

    }
    static async UpdateTought(req, res) {
        const id = req.params.id

        const tought = await Toughts.findOne({ where: { id: id }, raw: true })

        res.render('toughts/edit', { tought })


    }

    static async UpdateToughtPost(req, res) {

        const id = req.body.id

        const ToughtData = {
            title: req.body.title,
        }

        try {
            await Toughts.update(ToughtData, { where: { id: id } })
            req.flash('message', 'Pensamento atualizado com sucesso!')

            req.session.save(() => {

                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

}