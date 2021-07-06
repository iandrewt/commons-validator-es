import isIpAddress, { isIpv4Address, isIpv6Address } from '../src/isIpAddress';

describe('ip address validator', () => {
  it("should pass Apache's InetAddressValidatorTest#testInetAddressesFromTheWild", () => {
    expect(isIpAddress('140.211.11.130')).toBeTruthy(); // www.apache.org
    expect(isIpAddress('72.14.253.103')).toBeTruthy(); // www.l.google.com
    expect(isIpAddress('199.232.41.5')).toBeTruthy(); // fsf.org
    expect(isIpAddress('216.35.123.87')).toBeTruthy(); // appscs.ign.com
  });

  it("should pass Apache's InetAddressValidatorTest#testVALIDATOR_335", () => {
    expect(isIpAddress('2001:0438:FFFE:0000:0000:0000:0000:0A35')).toBeTruthy();
  });

  it("should pass Apache's InetAddressValidatorTest#testVALIDATOR_419", () => {
    expect(isIpAddress('0:0:0:0:0:0:13.1.68.3')).toBeTruthy();
    expect(isIpAddress('0:0:0:0:0:FFFF:129.144.52.38')).toBeTruthy();
    expect(isIpAddress('::13.1.68.3')).toBeTruthy();
    expect(isIpAddress('::FFFF:129.144.52.38')).toBeTruthy();

    expect(isIpAddress('::ffff:192.168.1.1:192.168.1.1')).toBeFalsy();
    expect(isIpAddress('::192.168.1.1:192.168.1.1')).toBeFalsy();
  });

  it("should pass Apache's InetAddressValidatorTest#testVALIDATOR_445", () => {
    expect(isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876')).toBeTruthy();
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/123'),
    ).toBeTruthy();
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/0'),
    ).toBeTruthy();
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876%0'),
    ).toBeTruthy();
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876%abcdefgh'),
    ).toBeTruthy();

    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/129'),
    ).toBeFalsy(); // too big
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/-0'),
    ).toBeFalsy(); // sign not allowed
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/+0'),
    ).toBeFalsy(); // sign not allowed
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/10O'),
    ).toBeFalsy(); // non-digit
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876/0%0'),
    ).toBeFalsy(); // /bits before %node-id
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876%abc defgh'),
    ).toBeFalsy(); // space in node id
    expect(
      isIpAddress('2001:0000:1234:0000:0000:C1C0:ABCD:0876%abc%defgh'),
    ).toBeFalsy(); // '%' in node id
  });

  it("should pass Apache's InetAddressValidatorTest#testInetAddressesByClass", () => {
    // class A
    expect(isIpAddress('24.25.231.12')).toBeTruthy();
    expect(isIpAddress('2.41.32.324')).toBeFalsy();

    // class B
    expect(isIpAddress('135.14.44.12')).toBeTruthy();
    expect(isIpAddress('154.123.441.123')).toBeFalsy();

    // class C
    expect(isIpAddress('213.25.224.32')).toBeTruthy();
    expect(isIpAddress('201.543.23.11')).toBeFalsy();

    // class D
    expect(isIpAddress('229.35.159.6')).toBeTruthy();
    expect(isIpAddress('231.54.11.987')).toBeFalsy();

    // class E
    expect(isIpAddress('248.85.24.92')).toBeTruthy();
    expect(isIpAddress('250.21.323.48')).toBeFalsy();
  });

  it("should pass Apache's InetAddressValidatorTest#testReservedInetAddresses", () => {
    expect(isIpAddress('127.0.0.1')).toBeTruthy();
    expect(isIpAddress('255.255.255.255')).toBeTruthy();
  });

  it("should pass Apache's InetAddressValidatorTest#testBrokenInetAddresses", () => {
    expect(isIpAddress('124.14.32.abc')).toBeFalsy();
    expect(isIpAddress('124.14.32.01')).toBeFalsy();
    expect(isIpAddress('23.64.12')).toBeFalsy();
    expect(isIpAddress('26.34.23.77.234')).toBeFalsy();
    expect(isIpAddress('')).toBeFalsy();
  });

  it("should pass Apache's InetAddressValidatorTest#testIPv6", () => {
    expect(isIpv6Address('')).toBeFalsy(); // empty string
    expect(isIpv6Address('::1')).toBeTruthy(); // loopback, compressed, non-routable
    expect(isIpv6Address('::')).toBeTruthy(); // unspecified, compressed, non-routable
    expect(isIpv6Address('0:0:0:0:0:0:0:1')).toBeTruthy(); // loopback, full
    expect(isIpv6Address('0:0:0:0:0:0:0:0')).toBeTruthy(); // unspecified, full
    expect(isIpv6Address('2001:DB8:0:0:8:800:200C:417A')).toBeTruthy(); // unicast, full
    expect(isIpv6Address('FF01:0:0:0:0:0:0:101')).toBeTruthy(); // multicast, full
    expect(isIpv6Address('2001:DB8::8:800:200C:417A')).toBeTruthy(); // unicast, compressed
    expect(isIpv6Address('FF01::101')).toBeTruthy(); // multicast, compressed
    expect(isIpv6Address('2001:DB8:0:0:8:800:200C:417A:221')).toBeFalsy(); // unicast, full
    expect(isIpv6Address('FF01::101::2')).toBeFalsy(); // multicast, compressed
    expect(isIpv6Address('fe80::217:f2ff:fe07:ed62')).toBeTruthy();
    expect(
      isIpv6Address('2001:0000:1234:0000:0000:C1C0:ABCD:0876'),
    ).toBeTruthy();
    expect(
      isIpv6Address('3ffe:0b00:0000:0000:0001:0000:0000:000a'),
    ).toBeTruthy();
    expect(
      isIpv6Address('FF02:0000:0000:0000:0000:0000:0000:0001'),
    ).toBeTruthy();
    expect(
      isIpv6Address('0000:0000:0000:0000:0000:0000:0000:0001'),
    ).toBeTruthy();
    expect(
      isIpv6Address('0000:0000:0000:0000:0000:0000:0000:0000'),
    ).toBeTruthy();
    expect(
      isIpv6Address('02001:0000:1234:0000:0000:C1C0:ABCD:0876'),
    ).toBeFalsy(); // extra 0 not allowed!
    expect(
      isIpv6Address('2001:0000:1234:0000:00001:C1C0:ABCD:0876'),
    ).toBeFalsy(); // extra 0 not allowed!
    expect(
      isIpv6Address('2001:0000:1234:0000:0000:C1C0:ABCD:0876 0'),
    ).toBeFalsy(); // junk after valid address
    expect(
      isIpv6Address('2001:0000:1234: 0000:0000:C1C0:ABCD:0876'),
    ).toBeFalsy(); // internal space
    expect(isIpv6Address('3ffe:0b00:0000:0001:0000:0000:000a')).toBeFalsy(); // seven segments
    expect(
      isIpv6Address('FF02:0000:0000:0000:0000:0000:0000:0000:0001'),
    ).toBeFalsy(); // nine segments
    expect(isIpv6Address('3ffe:b00::1::a')).toBeFalsy(); // double "::"
    expect(isIpv6Address('::1111:2222:3333:4444:5555:6666::')).toBeFalsy(); // double "::"
    expect(isIpv6Address('2::10')).toBeTruthy();
    expect(isIpv6Address('ff02::1')).toBeTruthy();
    expect(isIpv6Address('fe80::')).toBeTruthy();
    expect(isIpv6Address('2002::')).toBeTruthy();
    expect(isIpv6Address('2001:db8::')).toBeTruthy();
    expect(isIpv6Address('2001:0db8:1234::')).toBeTruthy();
    expect(isIpv6Address('::ffff:0:0')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5:6:7:8')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5:6::8')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5::8')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4::8')).toBeTruthy();
    expect(isIpv6Address('1:2:3::8')).toBeTruthy();
    expect(isIpv6Address('1:2::8')).toBeTruthy();
    expect(isIpv6Address('1::8')).toBeTruthy();
    expect(isIpv6Address('1::2:3:4:5:6:7')).toBeTruthy();
    expect(isIpv6Address('1::2:3:4:5:6')).toBeTruthy();
    expect(isIpv6Address('1::2:3:4:5')).toBeTruthy();
    expect(isIpv6Address('1::2:3:4')).toBeTruthy();
    expect(isIpv6Address('1::2:3')).toBeTruthy();
    expect(isIpv6Address('::2:3:4:5:6:7:8')).toBeTruthy();
    expect(isIpv6Address('::2:3:4:5:6:7')).toBeTruthy();
    expect(isIpv6Address('::2:3:4:5:6')).toBeTruthy();
    expect(isIpv6Address('::2:3:4:5')).toBeTruthy();
    expect(isIpv6Address('::2:3:4')).toBeTruthy();
    expect(isIpv6Address('::2:3')).toBeTruthy();
    expect(isIpv6Address('::8')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5:6::')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5::')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4::')).toBeTruthy();
    expect(isIpv6Address('1:2:3::')).toBeTruthy();
    expect(isIpv6Address('1:2::')).toBeTruthy();
    expect(isIpv6Address('1::')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5::7:8')).toBeTruthy();
    expect(isIpv6Address('1:2:3::4:5::7:8')).toBeFalsy(); // Double "::"
    expect(isIpv6Address('12345::6:7:8')).toBeFalsy();
    expect(isIpv6Address('1:2:3:4::7:8')).toBeTruthy();
    expect(isIpv6Address('1:2:3::7:8')).toBeTruthy();
    expect(isIpv6Address('1:2::7:8')).toBeTruthy();
    expect(isIpv6Address('1::7:8')).toBeTruthy();
    // IPv4 addresses as dotted-quads
    expect(isIpv6Address('1:2:3:4:5:6:1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4:5::1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4::1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2:3::1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2::1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1::1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2:3:4::5:1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2:3::5:1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1:2::5:1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1::5:1.2.3.4')).toBeTruthy();
    expect(isIpv6Address('1::5:11.22.33.44')).toBeTruthy();
    expect(isIpv6Address('1::5:400.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:260.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:256.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.256.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.2.256.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.2.3.256')).toBeFalsy();
    expect(isIpv6Address('1::5:300.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.300.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.2.300.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.2.3.300')).toBeFalsy();
    expect(isIpv6Address('1::5:900.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.900.3.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.2.900.4')).toBeFalsy();
    expect(isIpv6Address('1::5:1.2.3.900')).toBeFalsy();
    expect(isIpv6Address('1::5:300.300.300.300')).toBeFalsy();
    expect(isIpv6Address('1::5:3000.30.30.30')).toBeFalsy();
    expect(isIpv6Address('1::400.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::260.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::256.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::1.256.3.4')).toBeFalsy();
    expect(isIpv6Address('1::1.2.256.4')).toBeFalsy();
    expect(isIpv6Address('1::1.2.3.256')).toBeFalsy();
    expect(isIpv6Address('1::300.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::1.300.3.4')).toBeFalsy();
    expect(isIpv6Address('1::1.2.300.4')).toBeFalsy();
    expect(isIpv6Address('1::1.2.3.300')).toBeFalsy();
    expect(isIpv6Address('1::900.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1::1.900.3.4')).toBeFalsy();
    expect(isIpv6Address('1::1.2.900.4')).toBeFalsy();
    expect(isIpv6Address('1::1.2.3.900')).toBeFalsy();
    expect(isIpv6Address('1::300.300.300.300')).toBeFalsy();
    expect(isIpv6Address('1::3000.30.30.30')).toBeFalsy();
    expect(isIpv6Address('::400.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::260.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::256.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::1.256.3.4')).toBeFalsy();
    expect(isIpv6Address('::1.2.256.4')).toBeFalsy();
    expect(isIpv6Address('::1.2.3.256')).toBeFalsy();
    expect(isIpv6Address('::300.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::1.300.3.4')).toBeFalsy();
    expect(isIpv6Address('::1.2.300.4')).toBeFalsy();
    expect(isIpv6Address('::1.2.3.300')).toBeFalsy();
    expect(isIpv6Address('::900.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::1.900.3.4')).toBeFalsy();
    expect(isIpv6Address('::1.2.900.4')).toBeFalsy();
    expect(isIpv6Address('::1.2.3.900')).toBeFalsy();
    expect(isIpv6Address('::300.300.300.300')).toBeFalsy();
    expect(isIpv6Address('::3000.30.30.30')).toBeFalsy();
    expect(isIpv6Address('fe80::217:f2ff:254.7.237.98')).toBeTruthy();
    expect(isIpv6Address('::ffff:192.168.1.26')).toBeTruthy();
    expect(isIpv6Address('2001:1:1:1:1:1:255Z255X255Y255')).toBeFalsy(); // garbage instead of "." in IPv4
    expect(isIpv6Address('::ffff:192x168.1.26')).toBeFalsy(); // ditto
    expect(isIpv6Address('::ffff:192.168.1.1')).toBeTruthy();
    expect(isIpv6Address('0:0:0:0:0:0:13.1.68.3')).toBeTruthy(); // IPv4-compatible IPv6 address, full, deprecated
    expect(isIpv6Address('0:0:0:0:0:FFFF:129.144.52.38')).toBeTruthy(); // IPv4-mapped IPv6 address, full
    expect(isIpv6Address('::13.1.68.3')).toBeTruthy(); // IPv4-compatible IPv6 address, compressed, deprecated
    expect(isIpv6Address('::FFFF:129.144.52.38')).toBeTruthy(); // IPv4-mapped IPv6 address, compressed
    expect(isIpv6Address('fe80:0:0:0:204:61ff:254.157.241.86')).toBeTruthy();
    expect(isIpv6Address('fe80::204:61ff:254.157.241.86')).toBeTruthy();
    expect(isIpv6Address('::ffff:12.34.56.78')).toBeTruthy();
    expect(isIpv6Address('::ffff:2.3.4')).toBeFalsy();
    expect(isIpv6Address('::ffff:257.1.2.3')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4:1111:2222:3333:4444::5555')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4:1111:2222:3333::5555')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4:1111:2222::5555')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4:1111::5555')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4::5555')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4::')).toBeFalsy();
    // Testing IPv4 addresses represented as dotted-quads
    // Leading zeroes in IPv4 addresses not allowed: some systems treat the leading "0" in ".086" as the start of an octal number
    // Update: The BNF in RFC-3986 explicitly defines the dec-octet (for IPv4 addresses) not to have a leading zero
    expect(
      isIpv6Address('fe80:0000:0000:0000:0204:61ff:254.157.241.086'),
    ).toBeFalsy();
    expect(isIpv6Address('::ffff:192.0.2.128')).toBeTruthy(); // but this is OK, since there's a single digit
    expect(isIpv6Address('XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:1.2.3.4')).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:00.00.00.00'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:000.000.000.000'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:256.256.256.256'),
    ).toBeFalsy();
    expect(
      isIpv6Address('fe80:0000:0000:0000:0204:61ff:fe9d:f156'),
    ).toBeTruthy();
    expect(isIpv6Address('fe80:0:0:0:204:61ff:fe9d:f156')).toBeTruthy();
    expect(isIpv6Address('fe80::204:61ff:fe9d:f156')).toBeTruthy();
    expect(isIpv6Address(':')).toBeFalsy();
    expect(isIpv6Address('::ffff:c000:280')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444::5555:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::5555:')).toBeFalsy();
    expect(isIpv6Address('1111:2222::5555:')).toBeFalsy();
    expect(isIpv6Address('1111::5555:')).toBeFalsy();
    expect(isIpv6Address('::5555:')).toBeFalsy();
    expect(isIpv6Address(':::')).toBeFalsy();
    expect(isIpv6Address('1111:')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::5555')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::5555')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::5555')).toBeFalsy();
    expect(isIpv6Address(':1111::5555')).toBeFalsy();
    expect(isIpv6Address(':::5555')).toBeFalsy();
    expect(
      isIpv6Address('2001:0db8:85a3:0000:0000:8a2e:0370:7334'),
    ).toBeTruthy();
    expect(isIpv6Address('2001:db8:85a3:0:0:8a2e:370:7334')).toBeTruthy();
    expect(isIpv6Address('2001:db8:85a3::8a2e:370:7334')).toBeTruthy();
    expect(
      isIpv6Address('2001:0db8:0000:0000:0000:0000:1428:57ab'),
    ).toBeTruthy();
    expect(isIpv6Address('2001:0db8:0000:0000:0000::1428:57ab')).toBeTruthy();
    expect(isIpv6Address('2001:0db8:0:0:0:0:1428:57ab')).toBeTruthy();
    expect(isIpv6Address('2001:0db8:0:0::1428:57ab')).toBeTruthy();
    expect(isIpv6Address('2001:0db8::1428:57ab')).toBeTruthy();
    expect(isIpv6Address('2001:db8::1428:57ab')).toBeTruthy();
    expect(isIpv6Address('::ffff:0c22:384e')).toBeTruthy();
    expect(
      isIpv6Address('2001:0db8:1234:0000:0000:0000:0000:0000'),
    ).toBeTruthy();
    expect(
      isIpv6Address('2001:0db8:1234:ffff:ffff:ffff:ffff:ffff'),
    ).toBeTruthy();
    expect(isIpv6Address('2001:db8:a::123')).toBeTruthy();
    expect(isIpv6Address('123')).toBeFalsy();
    expect(isIpv6Address('ldkfj')).toBeFalsy();
    expect(isIpv6Address('2001::FFD3::57ab')).toBeFalsy();
    expect(isIpv6Address('2001:db8:85a3::8a2e:37023:7334')).toBeFalsy();
    expect(isIpv6Address('2001:db8:85a3::8a2e:370k:7334')).toBeFalsy();
    expect(isIpv6Address('1:2:3:4:5:6:7:8:9')).toBeFalsy();
    expect(isIpv6Address('1::2::3')).toBeFalsy();
    expect(isIpv6Address('1:::3:4:5')).toBeFalsy();
    expect(isIpv6Address('1:2:3::4:5:6:7:8:9')).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:7777:8888'),
    ).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:7777::')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666::')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444:5555::')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444::')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::')).toBeTruthy();
    expect(isIpv6Address('1111:2222::')).toBeTruthy();
    expect(isIpv6Address('1111::')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666::8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444:5555::8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444::8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222::8888')).toBeTruthy();
    expect(isIpv6Address('1111::8888')).toBeTruthy();
    expect(isIpv6Address('::8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444:5555::7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444::7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222::7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111::7777:8888')).toBeTruthy();
    expect(isIpv6Address('::7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444::6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222::6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111::6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('::6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222::5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111::5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('::5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111:2222::4444:5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111::4444:5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('::4444:5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('1111::3333:4444:5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('::3333:4444:5555:6666:7777:8888')).toBeTruthy();
    expect(isIpv6Address('::2222:3333:4444:5555:6666:7777:8888')).toBeTruthy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:123.123.123.123'),
    ).toBeTruthy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555::123.123.123.123'),
    ).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333:4444::123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('1111:2222::123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('1111::123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('::123.123.123.123')).toBeTruthy();
    expect(
      isIpv6Address('1111:2222:3333:4444::6666:123.123.123.123'),
    ).toBeTruthy();
    expect(isIpv6Address('1111:2222:3333::6666:123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('1111:2222::6666:123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('1111::6666:123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('::6666:123.123.123.123')).toBeTruthy();
    expect(
      isIpv6Address('1111:2222:3333::5555:6666:123.123.123.123'),
    ).toBeTruthy();
    expect(isIpv6Address('1111:2222::5555:6666:123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('1111::5555:6666:123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('::5555:6666:123.123.123.123')).toBeTruthy();
    expect(
      isIpv6Address('1111:2222::4444:5555:6666:123.123.123.123'),
    ).toBeTruthy();
    expect(isIpv6Address('1111::4444:5555:6666:123.123.123.123')).toBeTruthy();
    expect(isIpv6Address('::4444:5555:6666:123.123.123.123')).toBeTruthy();
    expect(
      isIpv6Address('1111::3333:4444:5555:6666:123.123.123.123'),
    ).toBeTruthy();
    expect(
      isIpv6Address('::2222:3333:4444:5555:6666:123.123.123.123'),
    ).toBeTruthy();
    // Trying combinations of "0" and "::"
    // These are all syntactically correct, but are bad form
    // because "0" adjacent to "::" should be combined into "::"
    expect(isIpv6Address('::0:0:0:0:0:0:0')).toBeTruthy();
    expect(isIpv6Address('::0:0:0:0:0:0')).toBeTruthy();
    expect(isIpv6Address('::0:0:0:0:0')).toBeTruthy();
    expect(isIpv6Address('::0:0:0:0')).toBeTruthy();
    expect(isIpv6Address('::0:0:0')).toBeTruthy();
    expect(isIpv6Address('::0:0')).toBeTruthy();
    expect(isIpv6Address('::0')).toBeTruthy();
    expect(isIpv6Address('0:0:0:0:0:0:0::')).toBeTruthy();
    expect(isIpv6Address('0:0:0:0:0:0::')).toBeTruthy();
    expect(isIpv6Address('0:0:0:0:0::')).toBeTruthy();
    expect(isIpv6Address('0:0:0:0::')).toBeTruthy();
    expect(isIpv6Address('0:0:0::')).toBeTruthy();
    expect(isIpv6Address('0:0::')).toBeTruthy();
    expect(isIpv6Address('0::')).toBeTruthy();
    // Invalid data
    expect(
      isIpv6Address('XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX'),
    ).toBeFalsy();
    // Too many components
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:7777:8888:9999'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:7777:8888::'),
    ).toBeFalsy();
    expect(
      isIpv6Address('::2222:3333:4444:5555:6666:7777:8888:9999'),
    ).toBeFalsy();
    // Too few components
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:7777')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333')).toBeFalsy();
    expect(isIpv6Address('1111:2222')).toBeFalsy();
    expect(isIpv6Address('1111')).toBeFalsy();
    // Missing :
    expect(isIpv6Address('11112222:3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:22223333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:33334444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:44445555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:55556666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:66667777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:77778888')).toBeFalsy();
    // Missing : intended for ::
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:7777:8888:'),
    ).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:7777:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:')).toBeFalsy();
    expect(isIpv6Address(':8888')).toBeFalsy();
    expect(isIpv6Address(':7777:8888')).toBeFalsy();
    expect(isIpv6Address(':6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':2222:3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(
      isIpv6Address(':1111:2222:3333:4444:5555:6666:7777:8888'),
    ).toBeFalsy();
    // :::
    expect(isIpv6Address(':::2222:3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:::3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:::4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:::7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:::8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:7777:::')).toBeFalsy();
    // Double ::
    expect(isIpv6Address('::2222::4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('::2222:3333::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444:5555::7777:8888')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444:5555:7777::8888')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444:5555:7777:8888::')).toBeFalsy();
    expect(isIpv6Address('1111::3333::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444:5555::7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444:5555:6666::8888')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444:5555:6666:7777::')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444:5555::7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444:5555:6666::8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444:5555:6666:7777::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::5555::7777:8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::5555:6666::8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::5555:6666:7777::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444::6666::8888')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444::6666:7777::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555::7777::')).toBeFalsy();
    // Too many components"
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:7777:8888:1.2.3.4'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:7777:1.2.3.4'),
    ).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666::1.2.3.4')).toBeFalsy();
    expect(
      isIpv6Address('::2222:3333:4444:5555:6666:7777:1.2.3.4'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:1.2.3.4.5'),
    ).toBeFalsy();
    // Too few components
    expect(isIpv6Address('1111:2222:3333:4444:5555:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1.2.3.4')).toBeFalsy();
    // Missing :
    expect(isIpv6Address('11112222:3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:22223333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:33334444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:44445555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:55556666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:66661.2.3.4')).toBeFalsy();
    // Missing .
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:255255.255.255'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:255.255255.255'),
    ).toBeFalsy();
    expect(
      isIpv6Address('1111:2222:3333:4444:5555:6666:255.255.255255'),
    ).toBeFalsy();
    // Missing : intended for ::
    expect(isIpv6Address(':1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':2222:3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    // :::
    expect(isIpv6Address(':::2222:3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:::3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:::4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:::1.2.3.4')).toBeFalsy();
    // Double ::
    expect(isIpv6Address('::2222::4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::2222:3333::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444:5555::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111::3333::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444:5555::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444:5555::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::5555::1.2.3.4')).toBeFalsy();
    // Missing parts
    expect(isIpv6Address('::.')).toBeFalsy();
    expect(isIpv6Address('::..')).toBeFalsy();
    expect(isIpv6Address('::...')).toBeFalsy();
    expect(isIpv6Address('::1...')).toBeFalsy();
    expect(isIpv6Address('::1.2..')).toBeFalsy();
    expect(isIpv6Address('::1.2.3.')).toBeFalsy();
    expect(isIpv6Address('::.2..')).toBeFalsy();
    expect(isIpv6Address('::.2.3.')).toBeFalsy();
    expect(isIpv6Address('::.2.3.4')).toBeFalsy();
    expect(isIpv6Address('::..3.')).toBeFalsy();
    expect(isIpv6Address('::..3.4')).toBeFalsy();
    expect(isIpv6Address('::...4')).toBeFalsy();
    // Extra : in front
    expect(isIpv6Address(':1111:2222:3333:4444:5555:6666:7777::')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555:6666::')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555::')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::')).toBeFalsy();
    expect(isIpv6Address(':1111::')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555:6666::8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555::8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::8888')).toBeFalsy();
    expect(isIpv6Address(':1111::8888')).toBeFalsy();
    expect(isIpv6Address(':::8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555::7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111::7777:8888')).toBeFalsy();
    expect(isIpv6Address(':::7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':::6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':::5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111::4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':::4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111::3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':::3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':::2222:3333:4444:5555:6666:7777:8888')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444:5555::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':::1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333:4444::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':::6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222:3333::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':::5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111:2222::4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111::4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':::4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':1111::3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    expect(isIpv6Address(':::2222:3333:4444:5555:6666:1.2.3.4')).toBeFalsy();
    // Extra : at end
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:7777:::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666:::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:::')).toBeFalsy();
    expect(isIpv6Address('1111:::')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555:6666::8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555::8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444::8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222::8888:')).toBeFalsy();
    expect(isIpv6Address('1111::8888:')).toBeFalsy();
    expect(isIpv6Address('::8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444:5555::7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444::7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222::7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111::7777:8888:')).toBeFalsy();
    expect(isIpv6Address('::7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333:4444::6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222::6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111::6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('::6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222:3333::5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222::5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111::5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('::5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111:2222::4444:5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111::4444:5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('::4444:5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('1111::3333:4444:5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('::3333:4444:5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('::2222:3333:4444:5555:6666:7777:8888:')).toBeFalsy();
    expect(isIpv6Address('0:a:b:c:d:e:f::')).toBeTruthy();
    expect(isIpv6Address('::0:a:b:c:d:e:f')).toBeTruthy(); // syntactically correct, but bad form (::0:... could be combined)
    expect(isIpv6Address('a:b:c:d:e:f:0::')).toBeTruthy();
    expect(isIpv6Address("':10.0.0.1")).toBeFalsy();
  });

  it('should not allow multiple prefixes in an IPv6 address', () => {
    expect(isIpv6Address('::fe80/64')).toBeTruthy();
    expect(isIpv6Address('::fe80/64/64')).toBeFalsy();
  });

  it('should not allow an IPv6 address if isIpv4Address is used', () => {
    expect(isIpv4Address('::fe80')).toBeFalsy();
  });

  it('should not allow an IPv4 address if isIpv6Address is called', () => {
    expect(isIpv6Address('192.168.1.1')).toBeFalsy();
  });
});
