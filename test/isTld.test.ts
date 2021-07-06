import isTld, {
  isCountryCodeTld,
  isGenericTld,
  isInfrastructureTld,
} from '../src/isTld';

describe('tld validator', () => {
  it("should pass Apache's DomainValidatorTest#testTopLevelDomains", () => {
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
    expect(isTld('.COM')).toBeTruthy();
    expect(isTld('.BiZ')).toBeTruthy();

    // corner cases
    expect(isTld('.nope')).toBeFalsy(); // this isn't guarenteed forever
    expect(isTld('')).toBeFalsy();
    expect(isTld(null)).toBeFalsy();
  });
});
