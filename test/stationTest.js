const { assert } = require('chai');
const supertest = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const app = require('../app');
const Station = require('../models/Station');
const User = require('../models/User');

describe('Station API', () => {
    let saveStub;
    let findStub;
    let findOneStub;
    let jwtSignStub;
    let jwtVerifyStub;
    let userStub;
    const testFilePath = path.join(__dirname, '../testImages/test.jpg');

    beforeEach(() => {
        saveStub = sinon.stub(Station.prototype, 'save');
        findStub = sinon.stub(Station, 'find');
        findOneStub = sinon.stub(Station, 'findOne');
        jwtSignStub = sinon.stub(jwt, 'sign');
        jwtVerifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
            callback(null, { userId: '5', role: 'admin' });
            // console.log('JWT verify called with:', token, secret, callback);
        });
        userStub = sinon.stub(User, 'findById').resolves({
            _id: '5',
            role: 'admin'
        });
        if (!fs.existsSync(testFilePath)) {
            fs.writeFileSync(testFilePath, 'Ceci est un fichier de test.');
        }
    });

    afterEach(() => {
        saveStub.restore();
        findStub.restore();
        findOneStub.restore();
        jwtSignStub.restore();
        jwtVerifyStub.restore();
        userStub.restore();
        if (fs.existsSync(testFilePath)) {
            fs.unlinkSync(testFilePath);
        }
    });

    it('POST /stations - should create a new station', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la sauvegarde d'une gare
        saveStub.resolves({
            _id: '1',
            name: 'Lyon Part Dieu',
            open_hour: '7:00',
            close_hour: '22:00'
        });

        await supertest(app)
            .post('/stations')
            .set('Authorization', `Bearer ${fakeToken}`)
            .field('name', 'Lyon Part Dieu')
            .field('open_hour', '7:00')
            .field('close_hour', '22:00')
            // .attach('image', testFilePath)
            .expect(201)
            .then(response => {
                console.log('Response error:', response.error);
                console.log('Response body:', response.body);
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Station créée avec succès.');
            });
    });

    it('GET /stations - should get all stations', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la recherche de gares
        findStub.resolves([
            {
                _id: '1',
                name: 'Lyon Part Dieu',
                open_hour: '7:00',
                close_hour: '22:00'
            },
            {
                _id: '2',
                name: 'Paris Gare de Lyon',
                open_hour: '6:00',
                close_hour: '23:00'
            }
        ]);

        await supertest(app)
            .get('/stations')
            .set('Authorization', `Bearer ${fakeToken}`)
            .expect(200)
            .then(response => {
                assert.equal(response.body.length, 2);
            });
    });

    it('PUT /stations/:id - should update a station', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la mise à jour d'une gare
        findOneStub.resolves({
            _id: '1',
            name: 'Lyon Part Dieu',
            open_hour: '7:00',
            close_hour: '22:00'
        });

        await supertest(app)
            .put('/stations/1')
            .set('Authorization', `Bearer ${fakeToken}`)
            .send({
                name: 'Lyon Perrache',
                open_hour: '6:00',
                close_hour: '23:00'
            })
            .expect(200)
            .then(response => {
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Station modifiée');
            });
    });

    it('DELETE /stations/:id - should delete a station', async () => {
        //Simuler la génération du token JWT
        const fakeToken = 'fake-jwt-token';
        jwtSignStub.returns(fakeToken);

        //Simuler la suppression d'une gare
        findOneStub.resolves({
            _id: '1',
            name: 'Lyon Part Dieu',
            open_hour: '7:00',
            close_hour: '22:00'
        });

        await supertest(app)
            .delete('/stations/1')
            .set('Authorization', `Bearer ${fakeToken}`)
            .expect(200)
            .then(response => {
                assert.equal(typeof response.body, 'object');
                assert.equal(response.body.message, 'Station et trains associés supprimés.');
            });
    });
})