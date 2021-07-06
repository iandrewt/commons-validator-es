const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

/**
 * Validates an IPv4 address. Returns true if valid.
 * @param address - address to check
 * @returns true if the argument contains a valid IPv4 address
 */
export const isIpv4Address = (address: string): boolean => {
  return ipv4Regex.test(address);
};

/**
 * Validates an IPv6 address. Returns true if valid.
 * @param address - address to check
 * @returns true if the argument contains a valid IPv6 address
 */
export const isIpv6Address = (address: string): boolean => {
  const splitPrefix = address.split('/');

  if (splitPrefix.length > 2) {
    return false;
  } else if (splitPrefix.length === 2) {
    if (!splitPrefix[1].match(/^\d{1,3}$/)) {
      return false;
    }

    const bits = parseInt(splitPrefix[1]); // cannot fail because regex check)
    if (bits < 0 || bits > 128) {
      return false;
    }
  }

  const splitZoneId = splitPrefix[0].split('%');

  if (splitZoneId.length > 2) {
    return false;
  } else if (splitZoneId.length === 2 && !splitZoneId[1].match(/^[^\s/%]+$/)) {
    // no whitespace, '/' or '%' allowed
    return false;
  }

  const ipv6Address = splitZoneId[0];
  const containsCompressedZeros = ipv6Address.includes('::');

  if (
    containsCompressedZeros &&
    ipv6Address.indexOf('::') !== ipv6Address.lastIndexOf('::')
  ) {
    return false;
  }

  if (
    (ipv6Address.startsWith(':') && !ipv6Address.startsWith('::')) ||
    (ipv6Address.endsWith(':') && !ipv6Address.endsWith('::'))
  ) {
    return false;
  }

  const octets = ipv6Address.split(':');

  if (containsCompressedZeros) {
    if (ipv6Address.endsWith('::')) {
      while (octets[octets.length - 1] === '') {
        octets.pop();
      }
      octets.push('');
    } else if (ipv6Address.startsWith('::') && octets.length) {
      octets.shift();
    }
  }

  if (octets.length > 8) {
    return false;
  }

  let validOctets = 0;

  for (let index = 0; index < octets.length; index++) {
    const octet = octets[index];

    if (octet) {
      if (index === octets.length - 1 && octet.includes('.')) {
        if (!isIpv4Address(octet)) {
          return false;
        }

        validOctets += 2;
        continue;
      }

      if (!/^[\dA-Fa-f]{1,4}$/.test(octet)) {
        return false;
      }
    }

    validOctets++;
  }

  if (validOctets > 8 || (validOctets < 8 && !containsCompressedZeros)) {
    return false;
  }

  return true;
};

/**
 * Checks if the specified string is a valid IP address.
 * @param address - the string to validate
 * @returns true if the string vaidates as an IP address
 */
const isIpAddress = (address: string): boolean => {
  return isIpv4Address(address) || isIpv6Address(address);
};

export default isIpAddress;
