# commons-validator-es

![npm](https://img.shields.io/npm/v/commons-validator-es)
![npm bundle size](https://img.shields.io/bundlephobia/min/commons-validator-es)
[![Node.js CI](https://github.com/iandrewt/commons-validator-es/actions/workflows/node.js.yml/badge.svg)](https://github.com/iandrewt/commons-validator-es/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/iandrewt/commons-validator-es/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/iandrewt/commons-validator-es/actions/workflows/codeql-analysis.yml)
[![Coverage Status](https://coveralls.io/repos/github/iandrewt/commons-validator-es/badge.svg)](https://coveralls.io/github/iandrewt/commons-validator-es)

[Apache Commons Validator](https://commons.apache.org/proper/commons-validator/)
ported to TypeScript as a async tree-shakable ES6 module

## Usage

Install the library with `npm install commons-validator-es`

To use as an ES6 module:

```ts
import { isEmail } from 'commons-validator-es';

await isEmail('test@test.com'); // => true
await isEmail('test@test.con'); // => false!
```

It works as a CommonJS module too, for backwards compatibility

```ts
const validator = require('commons-validator-es');

await validator.isEmail('test@test.com'); // => true
await validator.isEmail('test@test.con'); // => false!
```

## Supported validators

| Validator                                | Description                                                                                                                                                                                                              |
|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isEmail(email, allowLocal?, allowTld?)` | Checks if `email` is a valid email address. Ensures fields like the TLD are valid (no `.con`!)<br>If `allowLocal` is true, emails like `test@localhost` are valid<br>If `allowTld` is true, emails like `test@com` are valid |
| `isDomain(domain, allowLocal?)`          | Checks if `domain` is a valid domain name<br>If `allowLocal` is true, domains like `localhost.localdomain` are valid, as are single name labels (like `hostname`)                                                          |
| `isTld(tld, allowLocal?)`                | Checks if `tld` is a valid tld (`.com` is allowed but `.con` is not, for example)<br>If `allowLocal` is true, tlds like `localdomain` are valid                                                                            |
| `isIpAddress(address)`                   | Checks if `address` is a valid IPv4 or IPv6 address                                                                                                                                                                      |
| `isIpv4Address(address)`                 | Checks if `address` is a valid IPv4 address                                                                                                                                                                              |
| `isIpv6Address(address)`                 | Checks if `address` is a valid IPv6 address                                                                                                                                                                              |
| `isCountryCodeTld(ccTld)`                | Checks if `ccTld` is a valid country code TLD (like `.au`)                                                                                                                                                               |
| `isGenericTld(gTld)`                     | Checks if `gTld` is a valid generic TLD (like `.com`)                                                                                                                                                                    |
| `isInfrastructureTld(iTld)`              | Checks if `iTld` is a valid infrastructure TLD (only valid is `.arpa`)                                                                                                                                                   |
| `isLocalTld(lTld)`                       | Checks if `lTld` is a valid local TLD (like `.localdomain`)                                                                                                                                                              |

## Inspiration

[commons-validator-js](https://github.com/wix/commons-validator-js)
hasn't been updated in a while and does not export an ES6 module.
I'll be continuing to add more validators to this to bring it to parity with
Apache Commons Validator
