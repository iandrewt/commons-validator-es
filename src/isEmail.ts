import isDomain from './isDomain';
import isIpAddress from './isIpAddress';
import isTld from './isTld';

const specialChars = '\x00-\x1F\x7F\\(\\)<>@,;:\'\\\\\\"\\.\\[\\]';
const validChars = '(\\\\.)|[^\\s' + specialChars + ']';
const quotedUser = '("(\\\\"|[^"])*")';
const word = '((' + validChars + "|')+|" + quotedUser + ')';
const userRegex = new RegExp('^' + word + '(\\.' + word + ')*$');

const emailRegex = /^("?[^"\\]*(?:\\.[^"\\]*)*"?)?@([^\s@]+)$/;
const ipAddressRegex = /^\[(.*)\]$/;

/**
 * Returns true if the domain component of an email address is valid.
 * @private
 * @param domain - domain being validated
 * @param allowLocal - should local addresses be considered valid?
 * @param allowTld - should TLDs be allowed?
 * @returns true if the email address's domain is valid.
 */
const isValidDomain = (
  domain: string,
  allowLocal: boolean,
  allowTld: boolean,
): boolean => {
  const ipAddressGroups = domain.match(ipAddressRegex);

  if (ipAddressGroups) {
    return isIpAddress(ipAddressGroups[1]);
  }

  if (allowTld) {
    return (
      isDomain(domain, allowLocal) || (!domain.startsWith('.') && isTld(domain))
    );
  }

  return isDomain(domain, allowLocal);
};

/**
 * Returns true if the user component of an email address is valid.
 * @private
 * @param user - user being validated
 * @returns true if the username is valid
 */
const isValidUser = (user: string): boolean => {
  if (!user || user.length > 64) {
    return false;
  }

  return userRegex.test(user);
};

/**
 * Checks if the value is a valid email address.
 * @param email - The value validation is being performed on.
 * @param allowLocal - Should local addresses be considered valid?
 * @param allowTld - Should TLDs be allowed?
 * @returns true if the email address is valid.
 */
const isEmail = (
  email: string,
  allowLocal = false,
  allowTld = false,
): boolean => {
  if (!email) {
    return false;
  }

  if (email.endsWith('.')) {
    return false;
  }

  const groups = email.match(emailRegex);

  if (!groups) {
    return false;
  }

  if (!isValidUser(groups[1])) {
    return false;
  }

  if (!isValidDomain(groups[2], allowLocal, allowTld)) {
    return false;
  }

  return true;
};

export default isEmail;
