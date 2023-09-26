const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password, age, username) {
        const user = await UserModel.findOne({ email });
        if (user) {
            throw new ApiError.BadRequest(`User with this email: ${email} already exists`);
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const activationLink = uuid.v4();
        const newUser = await UserModel.create({ email, username, password: hashPassword, age, activationLink });

        await mailService.sendActivationMail(newUser.email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(newUser);//id, email, username, isActivated, age
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw new ApiError.BadRequest(`Incorrect activatoin link`);
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Incorrect user');
        }
        const isPaassEquals = await bcrypt.compare(password, user.password);
        if (!isPaassEquals) {
            throw ApiError.BadRequest('Incorrect password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshTocken) {
        if (!refreshTocken) {
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshTocken);
        const tokenFromDb = await tokenService.findToken(refreshTocken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnathorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}
module.exports = new UserService();