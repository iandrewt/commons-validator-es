import isTld, {
  isCountryCodeTld,
  isGenericTld,
  isInfrastructureTld,
} from '../src/isTld';

describe('tld validator', () => {
  it("should pass Apache's DomainValidatorTest#testTopLevelDomains", async () => {
    // infrastructure TLDs
    expect(isInfrastructureTld('.arpa')).toBeTruthy();
    expect(isInfrastructureTld('.com')).toBeFalsy();

    // generic TLDs
    expect(isGenericTld('.name')).toBeTruthy();
    expect(isGenericTld('.us')).toBeFalsy();

    // country code TLDs
    expect(isCountryCodeTld('.uk')).toBeTruthy();
    expect(isCountryCodeTld('.org')).toBeFalsy();

    // case-insensitive TLDs
    expect(isTld('.COM')).resolves.toBeTruthy();
    expect(isTld('.BiZ')).resolves.toBeTruthy();

    // punycode
    expect(isTld('.xn--p1ai')).resolves.toBeTruthy();
    expect(isTld('.\uFFFD')).resolves.toBeFalsy();

    // corner cases
    expect(isTld('.nope')).resolves.toBeFalsy(); // this isn't guarenteed forever
    expect(isTld('')).resolves.toBeFalsy();
    expect(isTld(null)).resolves.toBeFalsy();
  });
});
