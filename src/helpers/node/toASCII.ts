import { domainToASCII } from 'url';

/**
 * Convert string to punycode
 * @private
 * @param domain input to convert to punycode
 * @returns IDNA2008 representaiton of domain
 */
export const toASCII = (domain: string): string => {
  return domainToASCII(domain);
};
