import { expect } from 'chai'
import { TransactionAttributes } from '../transaction'

const Transaction = require('../transaction')

const validAttributes = (): TransactionAttributes => ({
  date: '01/06/2014',
  kind: 'normal',
  balance: 0,
  charge: '15000',
  deposit: 0,
  description: 'Giro cajero automatico',
})

describe('Transaction', () => {
  describe('constructor', () => {
    context('with valid keys', () => {
      it ('should not throw an error', () => {
        const attributes = validAttributes()
        const fn = () => (new Transaction(attributes))
        expect(fn).not.to.throw
      })
    })

    context('#build', () => {
      context('with valid keys and values', () => {
        it ('not throw errors', () => {
          const attributes = validAttributes()
          const trans = new Transaction(attributes)
          const fn = () => trans.build()

          expect(fn).not.to.throw
        })

        it('should return an object', () => {
          const attributes = validAttributes()
          const trans = new Transaction(attributes)

          expect(trans.build()).to.be.an('object')
        })

        it('should return expected attributes with default dues', () => {
          const attributes: TransactionAttributes = {
            date: '01/06/2014',
            kind: 'normal',
            balance: 0,
            charge: '15000',
            deposit: 0,
            description: 'Giro cajero automatico',
          }

          const expected = {
            date: attributes.date,
            kind: attributes.kind,
            balance: Number(attributes.balance),
            charge: Number(attributes.charge),
            deposit: Number(attributes.deposit),
            description: attributes.description,
            extended_description: attributes.extendedDescription || '',
            serial: attributes.serial || '',
            usd: Number(attributes.usd || 0),
            dues: {
              total: 1,
              current: 1,
              interest_rate: Number(attributes.interestRate || 0),
            }
          }
          const trans = new Transaction(attributes)

          expect(trans.build()).to.be.eql(expected)
        })
      })

      it ('should validate all values and keys', function () {
        const attributes = validAttributes()
        attributes.deposit = 1500.43
        const trans = new Transaction(attributes)

        const fn = () => trans.build()
        expect(fn).not.to.throw
      });

      it ('should validate all keys and decimal values', function () {
        const attributes = validAttributes()
        const withUSD = Object.assign(attributes, { usd: 25.00 })
        const trans = new Transaction(withUSD)

        const fn = () => trans.build()
        expect(fn).not.to.throw
      })

      it ('should throw if kind is not set', function () {
        const fn = () => {
          const attributes = validAttributes()
          attributes.kind = ""
          const trans = new Transaction(attributes)
          trans.build()
        }
        expect(fn).to.throw('Kind is not set')
      })

      it ('should throw if kind is empty', function () {
        const fn = () => {
          const attributes = validAttributes()
          delete attributes.kind
          const trans = new Transaction(attributes)
          trans.build()
        }
        expect(fn).to.throw('Invalid transaction kind')
      })
    })
  })
})
