const db    =   require('../models')
const UserModel = db.user
const jwtConfig = require('../config/jwtConfig');
const cache = require('../utils/cache.util')
const jwt = require('../utils/jwt.utils');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    // console.log(req) 
    const isExist = await UserModel.findOne({
        where:{
            email: req.body.email
        }
    })
    if(isExist) {
        return res.status(400).json({ message: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    return res.json(user);
}

exports.login = async (req, res) => {
    const user = await UserModel.findOne({
        where: {
            email: req.body.email
        }
    });
    if (user) {
        const isMatched = await bcrypt.compare(req.body.password, user.password);
        if (isMatched) {
            const token = await jwt.createToken({ id: user.id });
            return res.json({
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl
            });
        }
    }
    return res.status(400).json({ message: 'Unauthorized' });
}

exports.getUser = async (req, res) => {
    const user = await UserModel.findByPk(req.user.id);
    return res.json(user);
}

exports.logout = async (req, res) => { 
    const token = req.token;
    const now = new Date();
    const expire = new Date(req.user.exp);
    const milliseconds = now.getTime() - expire.getTime();
    /* ----------------------------- BlackList Token ---------------------------- */
    await cache.set(token, token, milliseconds);

    return res.json({ message: 'Logged out successfully' });
}