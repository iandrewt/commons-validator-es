import {
  countryCodeTlds,
  genericTlds,
  infrastructureTlds,
  localTlds,
} from './constants/tlds';
import { toASCII } from 'helpers';

/**
 * Removes leading dot from string
 * @private
 * @param str - the string to modify
 * @returns string without leading dot
 */
const chompLeadingDot = (str: string): string => {
  if (str[0] === '.') {
    return str.substring(1);
  }

  return str;
};

/**
 * Returns true if ccTld matches any IANA-defined country code top-level domain.
 * Leading dots are ignored if present.
 * The search is case-insensitive
 * @param ccTld - the parameter to check for country codeTLD status, not null
 * @returns true if the parameter is an country codeTLD
 */
export const isCountryCodeTld = (ccTld: string): boolean => {
  const key = chompLeadingDot(ccTld.toLowerCase());

  return countryCodeTlds.includes(key);
};

/**
 * Returns true if gTld matches any IANA-defined generic top-level domain.
 * Leading dots are ignored if present.
 * The search is case-insensitive
 * @param gTld - the parameter to check for generic TLD status, not null
 * @returns true if the parameter is an generic TLD
 */
export const isGenericTld = (gTld: string): boolean => {
  const key = chompLeadingDot(gTld.toLowerCase());

  return genericTlds.includes(key);
};

/**
 * Returns true if iTld matches any IANA-defined infrastructure top-level domain.
 * Leading dots are ignored if present.
 * The search is case-insensitive
 * @param iTld - the parameter to check for infrastructure TLD status, not null
 * @returns true if the parameter is an infrastructure TLD
 */
export const isInfrastructureTld = (iTld: string): boolean => {
  const key = chompLeadingDot(iTld.toLowerCase());

  return infrastructureTlds.includes(key);
};

/**
 * Returns true if lTld matches any widely used "local" domains (localhost or localdomain)
 * Leading dots are ignored if present.
 * The search is case-insensitive
 * @param lTld - the parameter to check for local TLD status, not null
 * @returns true if the parameter is an local TLD
 */
export const isLocalTld = (lTld: string): boolean => {
  const key = chompLeadingDot(lTld.toLowerCase());

  return localTlds.includes(key);
};

/**
 * Returns true if tld matches any IANA-defined top-level domain.
 * Leading dots are ignored if present.
 * The search is case-insentive.
 * If allowLocal is true, the TLD is checked using {@link isLocalTld}.
 * The TLD is then checked against {@link isCountryCodeTld}, {@link isGenericTld} and {@link isInfrastructureTld}.
 * @param tld - tld to check
 * @param allowLocal - whether local TLDs like ".localdomain" are allowed
 * @returns true if tld is a valid TLD, otherwise false
 */
const isTld = (tld: string, allowLocal = false): boolean => {
  if (!tld) {
    return false;
  }

  tld = toASCII(chompLeadingDot(tld));

  if (allowLocal && isLocalTld(tld)) {
    return true;
  }

  return isInfrastructureTld(tld) || isGenericTld(tld) || isCountryCodeTld(tld);
};

export default isTld;
