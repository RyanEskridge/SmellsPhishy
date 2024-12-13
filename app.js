const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const { clerkMiddleware } = require('@clerk/express');
const { ensureAuthenticated } = require('./utils/customMiddleware');
const breadcrumbs = require('./middleware/breadcrumbs');

const sequelize = require('./config/database');

const { EmailTemplate, Targets, Lists, Tests, Campaigns, TestTargets } = require('./models')

const { createLink } = require('./helpers/linkHelper');

const app = express();

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Public routes
app.use(express.static('public'));

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
app.use(clerkMiddleware());
app.use(ensureAuthenticated);

app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      increment: function (value) {
        return parseInt(value) + 1;
      },
      eq: function (arg1, arg2) {
        return arg1 == arg2;
      }
    }
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(breadcrumbs);



/* Routers for crucial parts of the app
that have children or require additional logic. */

const campaignsRouter = require('./routes/campaigns');
const testsRouter = require('./routes/tests');
const templatesRouter = require('./routes/templates');
const targetsRouter = require('./routes/targets');
const clickRouter = require('./routes/click');
const mailRouter = require('./routes/mail');
const settingsRouter = require('./routes/settings');

app.use('/campaigns', campaignsRouter);
app.use('/tests', testsRouter);
app.use('/templates', templatesRouter);
app.use('/targets', targetsRouter);
app.use('/click', clickRouter);
app.use('/settings', settingsRouter);



app.get('/', async (req, res) => {
  try {
    const [templateCount, targetCount, listCount, campaignCount, campaignActiveCount, testCount, testActiveCount, clickCount] = await Promise.all([
      EmailTemplate.count(),
      Targets.count(),
      Lists.count(),
      Campaigns.count(),
      Campaigns.count({ where: { status: true } }),
      Tests.count(),
      Tests.count({ where: { status: true } }),
      TestTargets.count({ where: { clicked: true}})
    ]);

    res.render('dashboard', {
      templateCount,
      targetCount,
      listCount,
      testCount,
      testActiveCount,
      campaignCount,
      campaignActiveCount,
      clickCount,
      title: 'Dashboard',
      description: 'Welcome to the dashboard'
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/create-bitly-link', async (req, res) => {
  const { url } = req.body;

  // Basic URL validation
  if (!url || !url.match(/^https?:\/\/[^\s$.?#].[^\s]*$/)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {Subject
    const link = await createLink(url);
    res.status(200).json({ link });
  } catch (error) {
    console.error('Error creating Bitly link:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to create Bitly link' });
  }
});

app.use(express.json());

// Services
app.use(mailRouter);

// Synchronize all models with the database
sequelize
  .sync({ force: false }) // Set to false if you want persistent DB. Remove in production.
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
