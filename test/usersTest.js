const assert = require('assert');
const supertest = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/User');

describe('User Router Test', () => {
    let findOneStub;
    let saveStub;
    let jwtSignStub;
    let bcryptCompareStub;

    beforeEach(() => {
        //stubber mongoose model
        findOneStub = sinon.stub(User, 'findOne');
        saveStub = sinon.stub(User.prototype, 'save');
        jwtSignStub = sinon.stub(jwt, 'sign');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        //restore mongoose model
        findOneStub.restore();
        saveStub.restore();
        jwtSignStub.restore();
        bcryptCompareStub.restore();
    });

    it('POST /users/register - utilisateur n\'existe pas', async () => {
        //Simuler qu'auncun utilisateur n'existe
        findOneStub.resolves(null);

        //Simuler la sauvegarde de l'utilisateur
        saveStub.resolves({
            username: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword'
        });

        await supertest(app)
            .post('/users/register')
            .send({ username: 'John Doe', email: 'john@example.com', password: 'azerty123' })
            .expect(201)
            .then(response => {
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.user.username, 'John Doe');
                assert.equal(response.body.user.email, 'john@example.com');
            });
    })

    it('POST /users/register - utilisateur existe', async () => {
        //Simuler qu'un utilisateur existe
        findOneStub.resolves({
            username: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword'
        });

        await supertest(app)
            .post('/users/register')
            .send({ username: 'John Doe', email: 'john@example.com', password: 'azerty123' })
            .expect(400)
            .then(response => {
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Utilisateur déjà existant.');
            });
    });

    it('POST /users/login - connexion réussie', async () => {
        //Simuler que l'utilisateur existe et mdp correct
        findOneStub.resolves({
            _id: 3,
            username: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword'
        });

        //Simuler la comparaison de mot de passe
        bcryptCompareStub.resolves(true);

        //Simuler la génération du JWT
        jwtSignStub.returns('fake-jwt_token');

        await supertest(app)
            .post('/users/login')
            .send({ username: 'John Doe', password: 'hashedpassword' })
            .expect(200)
            .then(response => {
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.token, 'fake-jwt_token');
            });
    });

    it('POST /users/login - utilisateur inexistant', async () => {
        //Simuler que l'utilisateur n'existe pas
        findOneStub.resolves(null);

        await supertest(app)
            .post('/users/login')
            .send({ username: 'John Doe', password: 'hashedpassword' })
            .expect(401)
            .then(response => {
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Utilisateur ou mot de passe incorrect.');
            });
    });

    it('POST /users/login - mot de passe incorrect', async () => {
        //Simuler que l'utilisateur existe
        findOneStub.resolves({
            _id: 3,
            username: 'John Doe',
            email: 'john@example.com',
            password: 'hashedpassword'
        });

        //Simuler la comparaison de mot de passe
        bcryptCompareStub.resolves(false);

        await supertest(app)
            .post('/users/login')
            .send({ username: 'John Doe', password: 'wrongpassword' })
            .expect(401)
            .then(response => {
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Utilisateur ou mot de passe incorrect.');
            });
    });
});