const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
require ('dotenv').config();
const routes = require('./controllers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

const sessionConfig = {
    secret: 'Super secret secret',
    cookie: {
        // Session will expire in 10 minutes
        expires: 10 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sessionConfig));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening on port ' + PORT));
});