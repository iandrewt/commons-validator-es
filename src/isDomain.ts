import { toASCII } from 'helpers';
import isTld from './isTld';

const domainLabelRegex = '[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?';
const topLabelRegex = '[a-zA-Z](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?';
const domainRegex = new RegExp(
  '^(?:' + domainLabelRegex + '\\.)*(' + topLabelRegex + ')\\.?$',
);

/**
 * Returns true if the specified domain parses as a valid domain
 * name with a recognised top-level domain.
 * The parsing is case-insensitive.
 * @param domain - the parameter to check for domain name syntax
 * @param allowLocal - should local addresses be considered valid?
 * @returns true if the parameter is a valid domain name
 */
const isDomain = (domain: string, allowLocal = false): boolean => {
  if (!domain) {
    return false;
  }

  domain = toASCII(domain);

  if (!domain || domain.length > 253) {
    return false;
  }

  const groups = domain.match(domainRegex);

  if (groups && groups.length > 1 && groups[0] !== groups[1]) {
    return isTld(groups[1], allowLocal);
  }

  return allowLocal && new RegExp(`^${domainLabelRegex}$`).test(domain);
};

export default isDomain;
