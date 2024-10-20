const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()


//Banco
const conn = require('./db/conn.js')

//models
const Tought = require('./models/Tought.js')
const User = require('./models/User.js')

//Routes
const ThoughtsRouter = require('./routes/ThoughtsRouter.js')
const authRouter= require('./routes/authRouter.js')
//controllers
const ToughtControllers = require('./controllers/ToughtController.js')


app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000)
        }
    })


)

app.use(flash())



app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

app.use('/toughts',ThoughtsRouter)
app.use('/',authRouter)
app.get('/',ToughtControllers.ShowToughts)




conn
    .sync()
    // .sync({force:true})
    .then(() => {
        app.listen(3000, console.log('online'))

    })
    .catch(() => { console.log(err) })