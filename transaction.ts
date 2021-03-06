const lodash = require('lodash')
const is = require('is_js')

const check = function (expected: boolean, msg: string) {
  if (!expected) {
    throw new Error(msg)
  }
}

const TRANSACTION_TYPES: Array<string> = [
  'normal',
  'due_cash',
  'due_commerce',
  'due_fixed',
  'due_advance',
  'total_due',
]

const VALID_KEYS: Array<string> = [
  'date',
  'kind',
  'balance',
  'charge',
  'deposit',
  'description',
  'extendedDescription',
  'serial',
  'dues',
  'usd',
]

export type TransactionAttributes = {
  date: string
  kind: string
  balance: number | string
  charge?: number | string
  deposit?: number | string
  description: string
  extendedDescription?: string
  serial?: string
  usd?: number
  dues?: {
    current: number
    total: number
  }
  interestRate?: number
}

type ReturnedTransaction = {
  date: string
  kind: string
  balance: number
  charge: number
  deposit: number
  description: string
  extended_description: string
  serial: string
  usd: number
  dues: {
    current: number
    total: number
    interest_rate: number
  }
}

type Dues = {
  current: number
  total: number
}

/**
 * Module to check and build transactions object.
 * @param {Object} transactionObj Object with transaction values.
 *
 */
export default class Transaction {
  private _date: string
  private _kind: string
  private _balance: number
  private _charge: number
  private _deposit: number
  private _description: string
  private _extendedDescription: string
  private _currentDue: number
  private _totalDues: number
  private _interestRate: number
  private _serial: string
  private _usd: number

  constructor(transactionObj: TransactionAttributes) {
    if (typeof transactionObj === 'undefined') {
      return this
    }

    this.checkKeys(transactionObj);
    this.date(transactionObj.date)
    this.kind(transactionObj.kind)
    this.balance(transactionObj.balance)
    this.charge(transactionObj.charge)
    this.deposit(transactionObj.deposit)
    this.description(transactionObj.description)
    this.extendedDescription(transactionObj.extendedDescription || '')
    if (typeof transactionObj.dues === 'undefined') {
      this.dues({
        current: 1,
        total: 1,
      })
    } else {
      this.dues({
        current: transactionObj.dues.current,
        total: transactionObj.dues.total,
      })
    }

    this.interestRate(transactionObj.interestRate || 0)
    this.serial(transactionObj.serial || '')
    this.usd(transactionObj.usd || 0)
  }

  build (): ReturnedTransaction {
    const date = this.date()
    const kind = this.kind()
    const balance = this.balance()
    const charge = this.charge()
    const deposit = this.deposit()
    const description = this.description()
    const extendedDescription = this.extendedDescription()
    const dues = this.dues()
    const currentDue = dues.current
    const totalDues = dues.total
    const interestRate = this.interestRate()
    const serial = this.serial()
    const usd = this.usd()

    return {
      date: date,
      kind: kind,
      balance: balance,
      charge: charge,
      deposit: deposit,
      description: description,
      extended_description: extendedDescription,
      dues: {
        current: currentDue,
        total: totalDues,
        interest_rate: interestRate
      },
      serial: serial,
      usd: usd,
    };
  };

  date (date?: string) {
    if (typeof date !== 'undefined') {
      this.isValidDate(date)
      this._date = date
    }
    return this._date
  }

  kind (kind?: string) {
    if (typeof kind === 'undefined') {
      this.isValidKind(this._kind)
      return this._kind
    }
    return this._kind = kind
  }

  balance (balance?: number | string) {
    if (typeof balance !== 'undefined') {
      this.isValidBalance(balance)
      this._balance = Number(balance)
    }
    return this._balance
  }

  charge (charge?: number | string) {
    if (typeof charge !== 'undefined') {
      this.isValidCharge(charge)
      this._charge = Number(charge)
    }
    return this._charge
  }

  deposit (deposit?: number | string) {
    if (typeof deposit !== 'undefined') {
      this.isValidDeposit(deposit)
      this._deposit = Number(deposit)
    }
    return this._deposit
  }

  description (description?: string) {
    if (typeof description !== 'undefined') {
      this.isValidDescription(description)
      this._description = description
    }
    return this._description
  }

  extendedDescription (extendedDescription?: string) {
    if (typeof extendedDescription !== 'undefined') {
      this.isValidExtendedDescription(extendedDescription)
      this._extendedDescription = extendedDescription
    }
    return this._extendedDescription
  }

  dues (objectDues?: Dues) {
    if (typeof objectDues !== 'undefined') {
      this.checkDues(objectDues.current, objectDues.total)
      this._currentDue = objectDues.current
      this._totalDues = objectDues.total
    }
    return {
      current: this._currentDue,
      total: this._totalDues,
    }
  }

  interestRate (interestRate?: number) {
    if (typeof interestRate !== 'undefined') {
      this.isValidInterestRate(interestRate)
      this._interestRate = interestRate
    }
    return this._interestRate
  };

  serial (serial?: string) {
    if (typeof serial !== 'undefined') {
      this.isValidSerial(serial)
      this._serial = serial
    }
    return this._serial
  };

  usd (usd?: number | string) {
    if (typeof usd !== 'undefined') {
      this.isValidUsd(usd)
      this._usd = Number(usd)
    }
    return this._usd
  };
  /**
  * Validates that the input string is a valid date formatted as "mm/dd/yyyy"
  * @param  {String}  dateString String with date to check.
  * @return {Boolean}            checked date
  * Extrated from
  * @url http://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
  */
  private isValidDate (dateString) {
    check(is.not.null(dateString), 'Date is not set')
    check(is.not.empty(dateString), 'Date is not set')
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      throw new Error('Invalid date string')
    }

    // Parse the date parts to integers
    const parts = dateString.split('/')
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) {
      throw new Error('Invalid date string')
    }

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1]
  }

  private checkDues (currentDue, totalDues) {
    check(is.number(Number(currentDue)), 'Current due is not a number')
    check(is.number(Number(totalDues)), 'Total dues is not a number')
    currentDue = parseInt(currentDue, 10)
    totalDues = parseInt(totalDues, 10)

    // Validations
    if (currentDue > totalDues || currentDue < 1) {
      throw new Error('Current dues can\'t be bigger than total dues or smaller than 1')
    }

    if (totalDues < 0) {
      throw new Error('Total dues can\'t be smaller than 1')
    }

    return true
  }

  private checkKeys (obj) {
    lodash.every(obj, (_, key) => {
      if (!lodash.includes(VALID_KEYS, key)) {
        throw new Error('Key \'' + key + '\' is not valid.')
      }

      return true
    })
  }

  private isValidKind (kind: string) {
    const noType = lodash.includes(TRANSACTION_TYPES, kind)
    check(is.not.null(kind), 'Kind is not set')
    check(is.not.empty(kind), 'Kind is not set')
    if (!noType) {
      throw new Error('Invalid transaction kind.')
    }

    if (typeof kind === 'undefined') {
      throw new Error('Kind cannot be undefined')
    }
  }

  private isValidBalance (balance: number | string) {
    check(is.not.null(balance), 'Balance is not set')
    check(is.not.empty(balance), 'Balance is not set')
    check(is.number(Number(balance)), 'Balance is not a valid number')
    return true
  }

  private isValidCharge  (charge: string | number) {
    check(is.not.null(charge), 'Charge is not set')
    check(is.not.empty(charge), 'Charge is not set')
    check(is.number(Number(charge)), `Charge is not a valid number: ${charge}`)
    check(is.above(Number(charge), -1), 'Charge must be a positive number')
    return true
  }

  private isValidDeposit (deposit: string | number) {
    check(is.not.null(deposit), 'Deposit is not set')
    check(is.not.empty(deposit), 'Deposit is not set')
    check(is.number(Number(deposit)), 'Deposit is not a valid number')
    check(is.above(Number(deposit), -1), 'Deposit must be a positive number')
    return true
  }

  private isValidUsd (usd: string | number) {
    check(is.not.null(usd), 'USD is not set')
    check(is.not.empty(usd), 'USD is not set')
    check(is.number(Number(usd)), 'USD is not a valid number')
    check(is.above(Number(usd), -1), 'USD must be a positive number')
    return true
  }

  private isValidDescription (description: string): boolean {
    check(is.not.null(description), 'Description can\'t be empty')
    check(is.not.empty(description), 'Description can\'t be empty')
    check(is.string(description), 'Description must be a string')
    return true
  };

  private isValidExtendedDescription (extendedDescription: string): boolean {
    return true
  }

  private isValidInterestRate (interestRate: number): boolean {
    check(is.number(interestRate), 'Interest rate must be a number')
    check(is.above(interestRate, -1), 'Interest rate must be a positive number')
    return true
  }

  private isValidSerial (isValidSerial: string): boolean {
    return true
  }
}

module.exports = Transaction;
