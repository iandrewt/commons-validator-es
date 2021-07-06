import {
  countryCodeTlds,
  genericTlds,
  infrastructureTlds,
  localTlds,
} from './tlds';

describe('tld check', () => {
  it('should have local tlds sorted', () => {
    expect(localTlds.concat().sort()).toEqual(localTlds);
  });

  it('should have country code tlds sorted', () => {
    expect(countryCodeTlds.concat().sort()).toEqual(countryCodeTlds);
  });

  it('should have generic tlds sorted', () => {
    expect(genericTlds.concat().sort()).toEqual(genericTlds);
  });

  it('should have infrastructure tlds sorted', () => {
    expect(infrastructureTlds.concat().sort()).toEqual(infrastructureTlds);
  });
});
