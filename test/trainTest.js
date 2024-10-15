const assert = require('assert');
const supertest = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Train = require('../models/Train');
const User = require('../models/User');
const Station = require('../models/Station');

describe('Train API', () => {
    let saveStub;
    let findStub;
    let findOneStub;
    let jwtSignStub;
    let jwtVerifyStub;
    let userStub;

    beforeEach(() => {
        saveStub = sinon.stub(Train.prototype, 'save');
        findStub = sinon.stub(Train, 'find');
        findOneStub = sinon.stub(Train, 'findOne');
        jwtSignStub = sinon.stub(jwt, 'sign');
        jwtVerifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, { userId: '5', role: 'admin' });
            console.log('JWT verify called with:', token, secret, callback);
        });
        //Simuler la recherche d'un utilisateur ayant le role admin
        userStub = sinon.stub(User, 'findById').resolves({
            _id: '5',
            role: 'admin'
        });
    });

    afterEach(() => {
        saveStub.restore();
        findStub.restore();
        findOneStub.restore();
        jwtSignStub.restore();
        jwtVerifyStub.restore();
        userStub.restore();
    });

    it('POST /trains - should create a new train', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        // Simuler la recherche de stations avec les IDs 2 et 3
        let findOneStationStub = sinon.stub(Station, 'findOne');
        findOneStationStub.withArgs({ name: 'Station A' }).resolves({ _id: '2', name: 'Station A' });
        findOneStationStub.withArgs({ name: 'Station B' }).resolves({ _id: '3', name: 'Station B' });

        //Simuler la sauvegarde du train
        saveStub.resolves({
            _id: '1',
            name: 'TGV Inoui',
            start_station: 'Station A',
            end_station: 'Station B',
            time_of_departure: '2021-07-01T07:00:00.000Z',
            time_of_arrival: '2021-07-01T09:00:00.000Z'
        });

        await supertest(app)
            .post('/trains')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
                name: 'TGV Inoui',
                start_station: 'Station A',
                end_station: 'Station B',
                time_of_departure: '2021-07-01T07:00:00.000Z',
                time_of_arrival: '2021-07-01T09:00:00.000Z'
            })
            .expect(201)
            .then(response => {
                console.log('Response error:', response.error);
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Train créé avec succès.');
            });
    });
});