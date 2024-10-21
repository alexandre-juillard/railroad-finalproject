const { assert } = require('chai');
const supertest = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Train = require('../models/Train');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

describe('Ticket', () => {
    let saveStub;
    let findOneStub;
    let jwtSignStub;
    let jwtVerifyStub;
    let findUserStub;
    let findTrainStub;

    beforeEach(() => {
        saveStub = sinon.stub(Ticket.prototype, 'save');
        findOneStub = sinon.stub(Ticket, 'findOne');
        jwtSignStub = sinon.stub(jwt, 'sign');
        jwtVerifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, { userId: '5', role: 'admin' });
            // console.log('JWT verify called with:', token, secret, callback);
        });
        findUserStub = sinon.stub(User, 'findById');
        findTrainStub = sinon.stub(Train, 'findById');
    });

    afterEach(() => {
        saveStub.restore();
        findOneStub.restore();
        jwtSignStub.restore();
        jwtVerifyStub.restore();
        findUserStub.restore();
        findTrainStub.restore();
    });

    it('POST /tickets/create - should create a new ticket', async () => {
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        // Recherche utilisateur et train
        findUserStub.resolves({ _id: '5' });
        findTrainStub.resolves({ _id: '6' });

        // Création du billet
        saveStub.resolves({
            user: '5',
            train: '6'
        });

        await supertest(app)
            .post('/tickets/create')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ userId: '5', trainId: '6' })
            .expect(201)
            .then(response => {
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Billet créé avec succès');
            });
    });

    it('POST /tickets/validate - should validate a ticket', async () => {
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        // Recherche utilisateur et train
        findUserStub.resolves({ _id: '5' });
        findTrainStub.resolves({ _id: '6' });

        // Recherche billet
        findOneStub.resolves({
            user: '5',
            train: '6',
            validated: false
        });

        await supertest(app)
            .post('/tickets/validate')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({ userId: '5', trainId: '6' })
            .expect(200)
            .then(response => {
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Billet validé avec succès');
            });
    });
});