/**
 * Use browser's punycode implementation to convert string for validation
 * @private
 * @param domain input to convert to punycode
 * @returns IDNA2008 representation of domain
 */
const browserToASCII = async (domain: string): Promise<string> => {
  const a = document.createElement('a');
  a.href = 'http://' + domain;
  return a.hostname;
};

/**
 * Use nodejs punycode implementation to convert string for validation
 * @private
 * @param domain input to convert to punycode
 * @returns IDNA2008 representaiton of domain
 */
const domainToASCII = async (domain: string): Promise<string> => {
  const url = await import('url');
  return url.domainToASCII(domain);
};

/**
 * Convert a domain to punycode
 * @private
 * @param domain input to convert to punycode
 * @returns IDNA2008 representation of domain
 */
const toASCII = async (domain: string): Promise<string> => {
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return await browserToASCII(domain);
  } else {
    return await domainToASCII(domain);
  }
};

export default toASCII;
