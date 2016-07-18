"use strict";
var chai_1 = require('chai');
var Transaction = require('../transaction');
console.log(Transaction);
var validAttributes = function () { return ({
    date: '01/06/2014',
    kind: 'normal',
    balance: 0,
    charge: '15000',
    deposit: 0,
    description: 'Giro cajero automatico'
}); };
var tests = {
    usd: {
        date: '01/06/2014',
        kind: 'normal',
        balance: 0,
        charge: 15000,
        deposit: 0,
        description: 'Giro cajero automatico',
        usd: 25.0
    },
    decimal: {
        date: '01/06/2014',
        kind: 'normal',
        balance: -1240,
        charge: 15000.5,
        deposit: 0,
        description: 'Giro cajero automatico',
        usd: 25.0
    },
    noKind: {
        date: '01/06/2014',
        balance: -1240,
        charge: 15000.5,
        deposit: 0,
        description: 'Giro cajero automatico',
        usd: 25.0
    }
};
describe('Transaction', function () {
    describe('Set object', function () {
        context('with valid keys', function () {
            it('should not throw an error', function () {
                var attributes = validAttributes();
                var fn = function () { return (new Transaction(attributes)); };
                chai_1.expect(fn).not.to.throw(/.+/);
            });
        });
        it('Should be built.', function () {
            var attributes = validAttributes();
            var trans = new Transaction(attributes);
            trans.build();
        });
        it('Should validate all values and keys', function () {
            var trans = new Transaction(tests.usd);
            trans.build();
        });
        it('Should validate all keys and decimal values', function () {
            var trans = new Transaction(tests.decimal);
            trans.build();
        });
        it('Should throw if kind is not set.', function () {
            var fn = function () {
                var attributes = validAttributes();
                delete attributes.kind;
                var trans = new Transaction(attributes);
                trans.build();
            };
            chai_1.expect(fn).to.throw('Kind is not set');
        });
        it('should set all property of a new instance and does not throw', function () {
            var t = new Transaction();
            t.date('01/06/2014');
            t.kind('normal');
            t.balance(0);
            t.charge(15000);
            t.deposit(0);
            t.description('Giro cajero automatico');
            t.build();
        });
    });
});
