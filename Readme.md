Transaction
===========

This class handles validation and formatting of bank transactions to be used in Yakuza scripts.

Requiring
=========
```javascript
    Transaction = require('./transaction');
    t = new Transaction() // Instance new transaction
    // or
    t = new Transaction(object)
```

This new instance should check every key of the given object. Only let pass valid keys of the list defined inside this module.

Example of valid transactions object.
-----------------
```
{
    'date': '01/02/2014',
    'kind': 'normal',
    'balance': 0,
    'charge': 15000,
    'deposit': 0,
    'description': 'Giro cajero automático',
    'extendedDescription': '',
    'dues': {
        'current': 1,
        'total': 1
    },
    'interestRate': 0,
    'serial': '',
    'usd': 0
}
```
Setters & getters
-----------------
Setters and getters are pattern matched functions that behave depending on wether an
argument was passed or not.

**Date**
Date can be passed as a formatted string.
Only in format *dd/mm/yyyy* where day and month are allowed to be prefixed by a *0*

Set:

    t.date('12/11/2004'); // Valid
    t.date('2-11-2004'); // Invalid
    t.date('12132012'); // Invalid
    t.date('32/12/2013'); // Invalid, day out of range

Get:

    t.date(); // Returns a string formatted as *dd/mm/yyyy* and prefixes day and month with a *0* when necessary
---
**Kind**
Kind must be a string and must be in the list of valid types (default is "normal")

Set:

    t.kind("normal"); // Valid
    t.kind("due"); // Valid
    t.kind("snoop dog") // Invalid

Get:

    t.kind()
---
**Balance, charge and deposit**
Balance, charge and deposit must be a valid number, greater or equal to 0.

Set:

    t.balance(10000) // Valid
    t.balance(-1000) // Invalid
    t.charge(10000) // Valid
    t.charge(-1000) // Invalid
    t.deposit(10000) // Valid
    t.deposit(-1000) // Invalid

Get:

	t.balance()
	t.charge()
	t.deposit()
---
**Description**
Description must be a valid string and not empty.

Set:

	t.description('Cargo por servicio')

Get:

	t.description()
---
**Extended description**
Extended description must be a valid string and can be empty.

Set:

	t.extendedDescription('Santiago') // Valid
	t.extendedDescription('') // Valid

Get:

	t.extendedDescription()
---
**Dues**
Dues receives an object with `current` and `total` fields. Where both must be integers bigger than *0* and current cannot be bigger than total

Set:

    t.dues({current: 1, total: 12}); // Valid
    t.dues({current: 3, total: 2}); // Invalid
    t.dues({current: 3}); // Invalid

Get:

    t.dues(); // Returns: {current: ..., total: ...}
---
**Interest Rate**
Interest must be a number, greater or equal than 0.

Set:

	t.intersestRate(0.1)

Get:

	t.interestRate()
---
**Serial**
Serial must be a valid string, can be empty

Set:

	t.serial('00023124412')

Get:

	t.serial()
---
**Usd**
Serial must be a valid string, can be empty

Set:

	t.usd('15.44')

Get:

	t.usd()
---
Also we can pass an object directly to the new instance:

```javascript
t = new Transactions({
    'date': '01/06/2014',
    'kind': 'normal',
    'balance': 0,
    'charge': 15000,
    'deposit': 0,
    'description': 'Giro cajero automatico'
  });
t.build();
```

This automatically check every key and value and create a new object with each value.

Building the transaction
------------------------

Once all attributes have been set, you can retrieve a final transaction object
with the `build` method.

    t.build(); // Returns {description: 'Foo', 'date': '01/01/2001' ... }

This method creates a new object if no exception has been triggered

Transactions object MUST contain
------------------------

```javascript
{
    'date': '...',
    'description': '...',
    'charge': '...',
    'balance': '...',
    'deposit': '...',
    'kind': : '...'
}
```

Optional values:

```javascript
{
    'extendedDescription': '...', // defaul value ''
    'serial': '...', // defaul value ''
    'dues': {
        'current': '...', // defaul value 1
        'total': '...', // defaul value 1
    },
    'interest_rate': '...' // defaul value 0
    'usd': '...' // defaul value 0
}
```

#### Troubles?

[Report issues](https://github.com/Finciero/finciero-transaction/issues)
