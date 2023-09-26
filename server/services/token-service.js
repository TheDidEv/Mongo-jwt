const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '15s'
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '15d'
        });

        return {
            accessToken,
            refreshToken
        }
    }

    //функція для збереження рефреш токену в базі даних для користувача
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshTocken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user: userId, refreshToken })
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData;
    }
}

module.exports = new TokenService();