/**
 * Convert string to punycode
 * @private
 * @param domain input to convert to punycode
 * @returns IDNA2008 representation of domain
 */
export const toASCII = (domain: string): string => {
  const a = document.createElement('a');
  a.href = 'http://' + domain;
  return a.hostname;
};
