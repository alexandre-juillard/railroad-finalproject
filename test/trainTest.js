const { assert } = require('chai');
const supertest = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Train = require('../models/Train');
const User = require('../models/User');
const Station = require('../models/Station');
const { query } = require('express');

describe('Train API', () => {
    let saveStub;
    let findStub;
    let findOneStub;
    let findOneStationStub;
    let jwtSignStub;
    let jwtVerifyStub;
    let userStub;

    beforeEach(() => {
        saveStub = sinon.stub(Train.prototype, 'save');
        // Stub de l'objet Query retourné par Train.find()
        const queryStub = {
            limit: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves([
                {
                    _id: '1',
                    name: 'TGV Inoui',
                    start_station: 'Station A',
                    end_station: 'Station B',
                    time_of_departure: '2021-07-01T07:00:00.000Z',
                    time_of_arrival: '2021-07-01T09:00:00.000Z'
                },
                {
                    _id: '2',
                    name: 'TGV Lyria',
                    start_station: 'Station B',
                    end_station: 'Station C',
                    time_of_departure: '2021-07-01T10:00:00.000Z',
                    time_of_arrival: '2021-07-01T12:00:00.000Z'
                }
            ])
        };
        findStub = sinon.stub(Train, 'find').returns(queryStub);
        findOneStub = sinon.stub(Train, 'findOne');

        // Simuler la recherche de stations avec les IDs 2 et 3
        findOneStationStub = sinon.stub(Station, 'findOne');
        findOneStationStub.withArgs({ name: 'Station A' }).resolves({ _id: '2', name: 'Station A' });
        findOneStationStub.withArgs({ name: 'Station B' }).resolves({ _id: '3', name: 'Station B' });

        jwtSignStub = sinon.stub(jwt, 'sign');
        jwtVerifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, { userId: '5', role: 'admin' });
            // console.log('JWT verify called with:', token, secret, callback);
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
        findOneStationStub.restore();
        jwtSignStub.restore();
        jwtVerifyStub.restore();
        userStub.restore();
    });

    it('POST /trains - should create a new train', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

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
                // console.log('Response error:', response.error);
                // console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Train créé avec succès.');
            });
    });

    it('POST /trains - should fail to create a new train with invalid data', async () => {
        // Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        // Simuler la sauvegarde du train
        saveStub.resolves({
            _id: '1',
            name: '',
            start_station: '2',
            end_station: '3',
            time_of_departure: '2021-07-01T07:00:00.000Z',
            time_of_arrival: '2021-07-01T09:00:00.000Z'
        });

        await supertest(app)
            .post('/trains')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
                name: '', // Nom invalide
                start_station: 'Station A',
                end_station: 'Station B',
                time_of_departure: 'invalid-date', // Date invalide
                time_of_arrival: '2021-07-01T09:00:00.000Z'
            })
            .expect(400)
            .then(response => {
                // console.log('Response error:', response.error);
                // console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.include(response.body.message, 'Donnée invalide');
            });
    });

    it('GET /trains - should return a list of trains with empty filter', async () => {

        const queryStub = {
            limit: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves([
                {
                    _id: '1',
                    name: 'TGV Inoui',
                    start_station: 'Station A',
                    end_station: 'Station B',
                    time_of_departure: '2021-07-01T07:00:00.000Z',
                    time_of_arrival: '2021-07-01T09:00:00.000Z'
                },
                {
                    _id: '2',
                    name: 'TGV Lyria',
                    start_station: 'Station B',
                    end_station: 'Station C',
                    time_of_departure: '2021-07-01T10:00:00.000Z',
                    time_of_arrival: '2021-07-01T12:00:00.000Z'
                }
            ])
        };

        // Simuler la recherche de trains
        findStub.withArgs({
            name: undefined,
            start_station: undefined,
            end_station: undefined,
            time_of_departure: undefined,
            time_of_arrival: undefined
        }).returns(queryStub);

        await supertest(app)
            .get('/trains')
            .expect(200)
            .then(response => {
                // console.log('Response error GET trains:', response.error);
                // console.log('Response body GET trains:', response.body);
                assert.equal(typeof response.body, 'object');
                // console.log('Response body length:', response.body.length);
                assert.equal(response.body.length, 2);
            });
    });

    it('GET /trains - should return a list of trains with filter', async () => {

        const queryStub = {
            limit: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves([
                {
                    _id: '1',
                    name: 'TGV Inoui',
                    start_station: 'Station A',
                    end_station: 'Station B',
                    time_of_departure: '2021-07-01T07:00:00.000Z',
                    time_of_arrival: '2021-07-01T09:00:00.000Z'
                }
            ])
        };

        // Simuler la recherche de trains
        findStub.withArgs({
            name: 'TGV Inoui',
            start_station: 'Station A',
            end_station: 'Station B',
            time_of_departure: '2021-07-01T07:00:00.000Z',
            time_of_arrival: '2021-07-01T09:00:00.000Z'
        }).returns(queryStub);

        await supertest(app)
            .get('/trains')
            .query({
                name: 'TGV Inoui',
                start_station: 'Station A',
                end_station: 'Station B',
                time_of_departure: '2021-07-01T07:00:00.000Z',
                time_of_arrival: '2021-07-01T09:00:00.000Z'
            })
            .expect(200)
            .then(response => {
                // console.log('Response error GET trains:', response.error);
                // console.log('Response body GET trains:', response.body);
                assert.equal(typeof response.body, 'object');
                // console.log('Response body length:', response.body.length);
                assert.equal(response.body.length, 1);
            });
    });

    it('PUT /trains/:id - should update a train', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la mise à jour du train
        findOneStub.resolves({
            _id: '1',
            name: 'TGV Inoui',
            start_station: 'Station A',
            end_station: 'Station B',
            time_of_departure: '2021-07-01T07:00:00.000Z',
            time_of_arrival: '2021-07-01T09:00:00.000Z'
        });

        await supertest(app)
            .put('/trains/1')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
                name: 'Nouveau nom de train', // Le nom a été changé
                start_station: 'Station A',
                end_station: 'Station B',
                time_of_departure: '2021-07-01T07:00:00.000Z',
                time_of_arrival: '2021-07-01T09:00:00.000Z'
            })
            .expect(200)
            .then(response => {
                console.log('Response error:', response.error);
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Train modifié avec succès.');
            });
    });

    it('DELETE /trains/:id - should delete a train', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la suppression du train
        findOneStub.resolves({
            _id: '1',
            name: 'TGV Inoui',
            start_station: 'Station A',
            end_station: 'Station B',
            time_of_departure: '2021-07-01T07:00:00.000Z',
            time_of_arrival: '2021-07-01T09:00:00.000Z'
        });

        await supertest(app)
            .delete('/trains/1')
            .set('Authorization', `Bearer ${fakeToken}`)
            .expect(200)
            .then(response => {
                // console.log('Response error:', response.error);
                // console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Train supprimé avec succès.');
            });
    });
});