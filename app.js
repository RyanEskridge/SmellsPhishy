const express = require('express');
const exphbs  = require('express-handlebars');

const path = require('path');
const mailHandler = require('./helpers/mailHandler');

const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const { ensureAuthenticated } = require('./utils/customMiddleware');

const sequelize = require('./config/database');
const EmailTemplate = require('./models/EmailTemplate');

const app = express();

require('dotenv').config();

// Public routes

app.use(express.static('public'))

app.get('/login', (req, res) => {
    const { userId } = req.auth || {};
    if (req.auth) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

app.get('/signup', (req, res) => {
    const { userId } = req.auth || {};
    if (req.auth) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'signup.html'));
    }
});

// Authenticate non-public routes

app.use(ClerkExpressWithAuth());
app.use(ensureAuthenticated);

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

/* Routers for crucial parts of the app
that have children or require additional logic. */

const campaignsRouter = require('./routes/campaigns');
const templatesRouter = require('./routes/templates');
const usersRouter = require('./routes/users');
const clickRouter = require('./routes/click');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/campaigns', campaignsRouter);
app.use('/templates', templatesRouter);
app.use('/users', usersRouter);
app.use('/click', clickRouter);

// Simple routes

app.get('/', (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        description: 'Welcome to the dashboard',
    });
});

app.get('/settings', (req, res) => {
    res.render('settings', {
        title: 'Settings',
        description: 'Adjust your settings here.',
    });
});

app.use(express.json());

// Webhook

app.post('/send-email', (req, res) => {
  mailHandler.sendMail(req, res);
});

// Synchronize all models with the database
sequelize.sync({ force: false }) // IMPORTAINT!!! Set to false in production!!!
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// App start

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
