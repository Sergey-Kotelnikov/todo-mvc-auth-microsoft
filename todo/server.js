// main file
const express = require('express')

// Handles server side and route requests
const app = express()

// ODM (object data module)
const mongoose = require('mongoose')

// Passport for login authorzation
const passport = require('passport')
const session = require('express-session')

//hold session, even after closing browser
const MongoStore = require('connect-mongo')(session)

//connect to mongo database
const connectDB = require('./config/database')

// To not allow to enter the "to dos" page without being logged in
const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todos')

// hold our environment variables
require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)


// function calling variable of const connectDB on line 18
connectDB()

//middlewear
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

  
app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    