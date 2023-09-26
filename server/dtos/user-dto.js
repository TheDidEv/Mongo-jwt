module.exports = class UserDto {
    email;
    id;
    username;
    age;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model.id
        this.isActivated = model.isActivated;
        this.username = model.username;
        this.age = model.age;
    }
}