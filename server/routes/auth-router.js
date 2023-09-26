const UserController = require('../controllers/user-controller');
const Router = require('express').Router;
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const authRoute = new Router();

authRoute.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 50 }),
    body('username').isLength({ min: 3, max: 50 }),
    body('age').isNumeric(),
    UserController.registration
);

authRoute.post('/login', UserController.login);
authRoute.post('/logout', UserController.logout);
authRoute.get('/activate/:link', UserController.activate);
authRoute.get('/refresh', UserController.refresh);
authRoute.get('/users', authMiddleware, UserController.users);

module.exports = authRoute;