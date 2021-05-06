const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const basicRoutes = require('./routes/basicRoutes')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const { checkPath } = require('./middleware/basicMiddleware')

const app = express()
dotenv.config()
// middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs')

// database connection
const dbURI = process.env.MONGODB_URI
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(3000 || process.env.PORT)
    console.log('Server Running at http://localhost:3000')
  })
  .catch((err) => console.log(err))

// routes
app.get('*', checkUser, checkPath)
app.get('/', (req, res) => res.render('index'))
app.use(authRoutes, basicRoutes)
