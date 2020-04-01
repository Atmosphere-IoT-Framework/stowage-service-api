// Import environmental variables from variables.test.env file
require('dotenv').config({ path: 'variables.test.env' });

// This line allow to test with the self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Import test tools
const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../database.js');
require('../security/authentication.js');
const Authorization = require('../security/authorization.js');
const server = require('../server.js');
const mongoose = require('mongoose');
const should = chai.should();
const factory = require('../commons/factory.js');
const User = mongoose.model('User');
const UserRoles = require('../types/userRoles.js');

chai.use(chaiHttp);

describe('is administrator?', () => {
    it('it should answer true if the user is an administrator', async () => {
        await factory.dropContents();;
        const user = await factory.createUser("test-username-1", "test-password-1", UserRoles.admin);
        const result = Authorization.isAdministrator(user);
        result.should.equal(true);
    });

    it('it should answer false if the user is a provided one', async () => {
        await factory.dropContents();;
        const user = await factory.createUser("test-username-1", "test-password-1", UserRoles.provider);
        const result = Authorization.isAdministrator(user);
        result.should.equal(false);
    });

    it('it should answer false if the user is an analyst', async () => {
        await factory.dropContents();;
        const user = await factory.createUser("test-username-1", "test-password-1", UserRoles.analyst);
        const result = Authorization.isAdministrator(user);
        result.should.equal(false);
    });
});

describe('is owner?', () => {
    it('it should answer true if the user is the owner of an element', async () => {
        await factory.dropContents();;
        const user = await factory.createUser("test-username-1", "test-password-1", UserRoles.admin);
        const element = await factory.createElement("test-element-1", user, null, []);
        const result = Authorization.isOwner(element, user);
        result.should.equal(true);
    });

    it('it should answer false if the user is not the owner of a device', async () => {
        await factory.dropContents();;
        const user_not_owner = await factory.createUser("test-username-1", "test-password-1", UserRoles.provider);
        const user_owner = await factory.createUser("test-username-2", "test-password-2", UserRoles.provider);
        const element = await factory.createElement("test-element-1", user_owner, null, []);
        const result = Authorization.isOwner(element, user_not_owner);
        result.should.equal(false);
    });
});
