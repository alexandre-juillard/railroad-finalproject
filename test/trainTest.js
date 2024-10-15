const assert = require('assert');
const supertest = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Train = require('../models/Train');

describe('Train API', () => {
    let saveStub;
    let findStub
    let findOneStub;
    let jwtSignStub;
    let jwtVerifyStub;

    beforeEach(() => {
        saveStub = sinon.stub(Train.prototype, 'save');
        findStub = sinon.stub(Train, 'find');
        findOneStub = sinon.stub(Train, 'findOne');
        jwtSignStub = sinon.stub(jwt, 'sign');
        jwtVerifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, { userId: '5', role: 'admin' });
            console.log('JWT verify called with:', token, secret, callback);
        });
    });

    afterEach(() => {
        saveStub.restore();
        findStub.restore();
        findOneStub.restore();
        jwtSignStub.restore();
        jwtVerifyStub.restore();
    });

    it('POST /trains - should create a new train', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la sauvegarde du train
        saveStub.resolves({
            _id: '1',
            name: 'TGV Inoui',
            start_station: '2',
            end_station: '3',
            time_of_departure: '2021-07-01T07:00:00.000Z',
            time_of_arrival: '2021-07-01T09:00:00.000Z'
        });

        await supertest(app)
            .post('/trains')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
                name: 'TGV Inoui',
                start_station: '2',
                end_station: '3',
                time_of_departure: '2021-07-01T07:00:00.000Z',
                time_of_arrival: '2021-07-01T09:00:00.000Z'
            })
            .expect(201)
            .then(response => {
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Train créé avec succès.');
            });
    });
});