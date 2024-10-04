# Smells Phishy
A simple cyber security tool that enables IT admins to test their users' suseptibility to Phising attacks.

### Technology Stack
---
[Node.js](https://nodejs.org/en/about) - Runtime environment
[Express.js](https://expressjs.com/) - Minimal JS app framework
[Handlebars.js](https://handlebarsjs.com/guide/#what-is-handlebars) - JS templating language
[Mailgun.js](https://documentation.mailgun.com/docs/mailgun/sdk/nodejs_sdk/) - Mail API
[Clerk.js](https://clerk.com/docs/backend-requests/handling/nodejs) - Authentication
[Cloudflare](https://www.cloudflare.com/) - DNS

### Access / Authentication

_Cloudflare_: You'll need to add your IP address to the whitelist. You can find it here:
Security > WAF > Custom Rules > IP Whitelist > Add your IP to the value box

_Clerk_: All pages are authenticated other than those in the `public` folder namely the login and signup pages.

### Routes
---
A [route](https://www.oyova.com/blog/what-is-a-route-web-dev/) defines a path within the application. This path correlates with a specific URL pattern. 

Simple routes that don't have children or require additional logic are located in `app.js`. 

Routes which have children or require greater functionality are  initialized in `app.js` and further defined in `routes/{specificRoute}.js`


``` JavaScript
// File: app.js

/* Routers for crucial parts of the app
that have children or require additional logic. */

const campaignsRouter = require('./routes/campaigns');
const templatesRouter = require('./routes/templates')
const usersRouter = require('./routes/users');
const clickRouter = require('./routes/click');  

// Set base routes

app.use('/campaigns', campaignsRouter);
app.use('/templates', templatesRouter);
app.use('/users', usersRouter);
app.use('/click', clickRouter);

...

// Simple route example

app.get('/settings', (req, res) => {
    res.render('settings', {
        title: 'Settings',
        description: 'Adjust your settings here.',
    });
});

```


Now, lets look further into one of the more involved routes. 

``` JavaScript
// File: app.js

// The template router is initialized in app.js
 
const templatesRouter = require('./routes/templates')
app.use('/templates', templatesRouter);

---

// File: routes/templates.js

/* And individual routes are further defined 
in routes/templates.js */

router.get('/new', (req, res) => {
    res.render('templates_new', {
        title: 'Create New Template',
        description: 'Create a new template here.',
    });
});

```


Note: You can see that `/templates` is implied and not included, because it is within the templates router. 


### Views
---
Layouts are a _base template_ for pages. 

Layouts include parts of the application that don't change from one page to the next. Navigation menu, footer, etc. 

Views _extend_ layouts. 

Views are where content changes from page-to-page, usually within the body of the page. 

Handlebars.js is the templating language we're using. It uses the `.hbs` extension.

Most pages within the application will use the base layout `layouts/main.hbs` 

Inside of the `layouts/main.hbs` file you'll notice the handlebars syntax `{{ body }}` within the opening and closing body HTML tags. 

The contents of `{{ body }}` will vary depending on which view is defined in our routes. 


``` JavaScript
// File: routes/templates.js

router.get('/new', (req, res) => {
    res.render('templates_new', {
        title: 'Create New Template',
        description: 'Create a new template here.',
    });
});

```

The contents of `{{ body }}` in this case are what is contained in our   `views\templates_new.hbs` file.

You can see that `title` and `description` are also passed from the server. The first argument given to the res.render() function is the name of our `templates_new` view, which is served when `/templates/new` is requested. 


``` JavaScript
// File: views/templates_new.hbs

<h1>{{title}}</h1>
<p>{{description}}</p>
```


**In conclusion**: The user requests /templates/new. Express.js grabs the `main.hbs` layout, injects the contents of `views/templates_new.hbs` into the body, and then serves it to the user. 


### Utils
---
_Utility functions_ should have a more general use-case. They are functions that can be re-used across the entirety of the app.

### Helpers
---
_Helper functions_ should have a very narrow use-case. They are functions that are used to complete a specific task. 

