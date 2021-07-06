# commons-validator-es

[Apache Commons Validator](https://commons.apache.org/proper/commons-validator/)
ported to TypeScript as an ES6 module

## Usage

Install the library with `npm install commons-validator-es`

```ts
import { isEmail } from 'commons-validator-es'

isEmail('test@test.com'); // => true
isEmail('test@test.con'); // => false!
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
