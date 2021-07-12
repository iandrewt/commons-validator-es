import isEmail from '../src/isEmail';

describe('email validator', () => {
  it("should pass Apache's EmailValidatorTest#testEmail", () => {
    expect(isEmail('jsmith@apache.org')).toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithNumericAddress", () => {
    expect(isEmail('someone@[216.109.118.76]')).toBeTruthy();
    expect(isEmail('someone@yahoo.com')).toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailExtension", () => {
    expect(isEmail('jsmith@apache.org')).toBeTruthy();
    expect(isEmail('jsmith@apache.com')).toBeTruthy();
    expect(isEmail('jsmith@apache.net')).toBeTruthy();
    expect(isEmail('jsmith@apache.info')).toBeTruthy();
    expect(isEmail('jsmith@apache.')).toBeFalsy();
    expect(isEmail('jsmith@apache.c')).toBeFalsy();
    expect(isEmail('someone@yahoo.museum')).toBeTruthy();
    expect(isEmail('someone@yahoo.mu-seum')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithDash", () => {
    expect(isEmail('andy.noble@data-workshop.com')).toBeTruthy();
    expect(isEmail('andy-noble@data-workshop.-com')).toBeFalsy();
    expect(isEmail('andy-noble@data-workshop.c-om')).toBeFalsy();
    expect(isEmail('andy-noble@data-workshop.co-m')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithDotEnd", () => {
    expect(isEmail('andy.noble@data-workshop.com.')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithBogusCharacter", () => {
    expect(isEmail('andy.noble@\u008fdata-workshop.com')).toBeFalsy();

    // The ' characteris valid in an email username.
    expect(isEmail("andy.o'reilly@data-workshop.com")).toBeTruthy();

    // But not in the domain name.
    expect(isEmail("andy@o'reilly.data-workshop.com")).toBeFalsy();

    // The + character is valid in an email username.
    expect(isEmail('foo+bar@i.am.not.in.us.example.com')).toBeTruthy();

    // But not in the domain name
    expect(isEmail('foo+bar@example+3.com')).toBeFalsy();

    // Domains iwth only special characters aren't allowed (VALIDATOR-286)
    expect(isEmail('test@%*.com')).toBeFalsy();
    expect(isEmail('test@^&#.com')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testVALIDATOR_315", () => {
    expect(isEmail('me@at&t.net')).toBeFalsy();
    expect(isEmail('me@att.net')).toBeTruthy(); // Make sure TLD is not the cause of the failure
  });

  it("should pass Apache's EmailValidatorTest#testVALIDATOR_278", () => {
    expect(isEmail('someone@-test.com')).toBeFalsy(); // hostname starts with a dash/hyphen
    expect(isEmail('someone@test-.com')).toBeFalsy(); // hostname ends iwth a dash-hyphen
  });

  it("should pass Apache's EmailValidatorTest#testValidator235", () => {
    expect(isEmail('someone@xn--d1abbgf6aiiy.xn--p1ai')).toBeTruthy();
    expect(isEmail('someone@президент.рф')).toBeTruthy();
    expect(isEmail('someone@www.b\u00fccher.ch')).toBeTruthy();
    expect(isEmail('someone@www.\uFFFD.ch')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithCommas", () => {
    expect(isEmail('jowblow@apa,che.org')).toBeFalsy();
    expect(isEmail('jowblow@apache.o,rg')).toBeFalsy();
    expect(isEmail('jowblow@apache,org')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithSpaces", () => {
    expect(isEmail('joeblow @apache.org')).toBeFalsy();
    expect(isEmail('joeblow@ apache.org')).toBeFalsy();
    expect(isEmail(' joeblow@apache.org')).toBeFalsy();
    expect(isEmail('joeblow@apache.org ')).toBeFalsy();
    expect(isEmail('joe blow@apache.org')).toBeFalsy();
    expect(isEmail('joeblow@apa che.org')).toBeFalsy();
    expect(isEmail('"joeblow "@apache.org')).toBeTruthy();
    expect(isEmail('" joeblow"@apache.org')).toBeTruthy();
    expect(isEmail('" joeblow "@apache.org')).toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithControlChars", () => {
    for (let c = 0; c < 32; c++) {
      expect(
        isEmail('foo' + String.fromCharCode(c) + 'bar@domain.com'),
      ).toBeFalsy();
    }

    expect(
      isEmail('foo' + String.fromCharCode(127) + 'bar@domain.com'),
    ).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailLocalhost", () => {
    expect(isEmail('joe@localhost.localdomain', true)).toBeTruthy();
    expect(isEmail('joe@localhost', true)).toBeTruthy();

    expect(isEmail('joe@localhost.localdomain')).toBeFalsy();
    expect(isEmail('joe@localhost')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithSlashes", () => {
    expect(isEmail('joe!/blow@apache.org')).toBeTruthy();
    expect(isEmail('joe@ap/ache.org')).toBeFalsy();
    expect(isEmail('joe@apac!he.org')).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailUserName", () => {
    expect(isEmail('joe1blow@apache.org')).toBeTruthy();
    expect(isEmail('joe$blow@apache.org')).toBeTruthy();
    expect(isEmail('joe-@apache.org')).toBeTruthy();
    expect(isEmail('joe_@apache.org')).toBeTruthy();
    expect(isEmail('joe+@apache.org')).toBeTruthy(); // + is valid unquoted
    expect(isEmail('joe!@apache.org')).toBeTruthy(); // ! is valid unquoted
    expect(isEmail('joe*@apache.org')).toBeTruthy(); // * is valid unquoted
    expect(isEmail("joe'@apache.org")).toBeTruthy(); // ' is valid unquoted
    expect(isEmail('joe%45@apache.org')).toBeTruthy(); // % is valid unquoted
    expect(isEmail('joe?@apache.org')).toBeTruthy(); // ? is valid unquoted
    expect(isEmail('joe&@apache.org')).toBeTruthy(); // & ditto
    expect(isEmail('joe=@apache.org')).toBeTruthy(); // = ditto
    expect(isEmail('+joe@apache.org')).toBeTruthy(); // + is valid unquoted
    expect(isEmail('!joe@apache.org')).toBeTruthy(); // ! is valid unquoted
    expect(isEmail('*joe@apache.org')).toBeTruthy(); // * is valid unquoted
    expect(isEmail("'joe@apache.org")).toBeTruthy(); // ' is valid unquoted
    expect(isEmail('%joe45@apache.org')).toBeTruthy(); // % is valid unquoted
    expect(isEmail('?joe@apache.org')).toBeTruthy(); // ? is valid unquoted
    expect(isEmail('&joe@apache.org')).toBeTruthy(); // & ditto
    expect(isEmail('=joe@apache.org')).toBeTruthy(); // = ditto
    expect(isEmail('+@apache.org')).toBeTruthy(); // + is valid unquoted
    expect(isEmail('!@apache.org')).toBeTruthy(); // ! is valid unquoted
    expect(isEmail('*@apache.org')).toBeTruthy(); // * is valid unquoted
    expect(isEmail("'@apache.org")).toBeTruthy(); // ' is valid unquoted
    expect(isEmail('%@apache.org')).toBeTruthy(); // % is valid unquoted
    expect(isEmail('?@apache.org')).toBeTruthy(); // ? is valid unquoted
    expect(isEmail('&@apache.org')).toBeTruthy(); // & ditto
    expect(isEmail('=@apache.org')).toBeTruthy(); // = ditto

    // UnQuoted Special characters are invalid
    expect(isEmail('joe.@apache.org')).toBeFalsy(); // . not allowed at end of local part
    expect(isEmail('.joe@apache.org')).toBeFalsy(); // . not allowed at start of local part
    expect(isEmail('.@apache.org')).toBeFalsy(); // . not allowed alone
    expect(isEmail('joe.ok@apache.org')).toBeTruthy(); // . allowed embedded
    expect(isEmail('joe..ok@apache.org')).toBeFalsy(); // .. not allowed embedded
    expect(isEmail('..@apache.org')).toBeFalsy(); // .. not allowed alone
    expect(isEmail('joe(@apache.org')).toBeFalsy();
    expect(isEmail('joe)@apache.org')).toBeFalsy();
    expect(isEmail('joe,@apache.org')).toBeFalsy();
    expect(isEmail('joe;@apache.org')).toBeFalsy();

    // Quoted Special characters are valid
    expect(isEmail('"joe."@apache.org')).toBeTruthy();
    expect(isEmail('".joe"@apache.org')).toBeTruthy();
    expect(isEmail('"joe+"@apache.org')).toBeTruthy();
    expect(isEmail('"joe@"@apache.org')).toBeTruthy();
    expect(isEmail('"joe!"@apache.org')).toBeTruthy();
    expect(isEmail('"joe*"@apache.org')).toBeTruthy();
    expect(isEmail('"joe\'"@apache.org')).toBeTruthy();
    expect(isEmail('"joe("@apache.org')).toBeTruthy();
    expect(isEmail('"joe)"@apache.org')).toBeTruthy();
    expect(isEmail('"joe,"@apache.org')).toBeTruthy();
    expect(isEmail('"joe%45"@apache.org')).toBeTruthy();
    expect(isEmail('"joe;"@apache.org')).toBeTruthy();
    expect(isEmail('"joe?"@apache.org')).toBeTruthy();
    expect(isEmail('"joe&"@apache.org')).toBeTruthy();
    expect(isEmail('"joe="@apache.org')).toBeTruthy();
    expect(isEmail('".."@apache.org')).toBeTruthy();

    // escaped quote character valid in quoted string
    expect(isEmail('"john\\"doe"@apache.org')).toBeTruthy();
    expect(
      isEmail(
        'john56789.john56789.john56789.john56789.john56789.john56789.john@example.com',
      ),
    ).toBeTruthy();
    expect(
      isEmail(
        'john56789.john56789.john56789.john56789.john56789.john56789.john5@example.com',
      ),
    ).toBeFalsy();
    expect(
      isEmail('\\>escape\\\\special\\^characters\\<@example.com'),
    ).toBeTruthy();
    expect(isEmail('Abc\\@def@example.com')).toBeTruthy();
    expect(isEmail('Abc@def@example.com')).toBeFalsy();
    expect(isEmail('space\\ monkey@example.com')).toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testValidator293", () => {
    expect(isEmail('abc-@abc.com')).toBeTruthy();
    expect(isEmail('abc_@abc.com')).toBeTruthy();
    expect(isEmail('abc-def@abc.com')).toBeTruthy();
    expect(isEmail('abc_def@abc.com')).toBeTruthy();
    expect(isEmail('abc@abc_def.com')).toBeFalsy();
  });

  it("should pass Apache's EmailValidaotrTest#testValidator365", () => {
    expect(
      isEmail(
        'Loremipsumdolorsitametconsecteturadipiscingelit.Nullavitaeligulamattisrhoncusnuncegestasmattisleo.' +
          'Donecnonsapieninmagnatristiquedictumaacturpis.Fusceorciduifacilisisutsapieneuconsequatpharetralectus.' +
          'Quisqueenimestpulvinarutquamvitaeportamattisex.Nullamquismaurisplaceratconvallisjustoquisportamauris.' +
          'Innullalacusconvalliseufringillautvenenatissitametdiam.Maecenasluctusligulascelerisquepulvinarfeugiat.' +
          'Sedmolestienullaaliquetorciluctusidpharetranislfinibus.Suspendissemalesuadatinciduntduisitametportaarcusollicitudinnec.' +
          'Donecetmassamagna.Curabitururnadiampretiumveldignissimporttitorfringillaeuneque.' +
          'Duisantetelluspharetraidtinciduntinterdummolestiesitametfelis.Utquisquamsitametantesagittisdapibusacnonodio.' +
          'Namrutrummolestiediamidmattis.Cumsociisnatoquepenatibusetmagnisdisparturientmontesnasceturridiculusmus.' +
          'Morbiposueresedmetusacconsectetur.Etiamquisipsumvitaejustotempusmaximus.Sedultriciesplaceratvolutpat.' +
          'Integerlacuslectusmaximusacornarequissagittissitametjusto.' +
          'Cumsociisnatoquepenatibusetmagnisdisparturientmontesnasceturridiculusmus.Maecenasindictumpurussedrutrumex.Nullafacilisi.' +
          'Integerfinibusfinibusmietpharetranislfaucibusvel.Maecenasegetdolorlacinialobortisjustovelullamcorpersem.' +
          'Vivamusaliquetpurusidvariusornaresapienrisusrutrumnisitinciduntmollissemnequeidmetus.' +
          'Etiamquiseleifendpurus.Nuncfelisnuncscelerisqueiddignissimnecfinibusalibero.' +
          'Nuncsemperenimnequesitamethendreritpurusfacilisisac.Maurisdapibussemperfelisdignissimgravida.' +
          'Aeneanultricesblanditnequealiquamfinibusodioscelerisqueac.Aliquamnecmassaeumaurisfaucibusfringilla.' +
          'Etiamconsequatligulanisisitametaliquamnibhtemporquis.Nuncinterdumdignissimnullaatsodalesarcusagittiseu.' +
          'Proinpharetrametusneclacuspulvinarsedvolutpatliberoornare.Sedligulanislpulvinarnonlectuseublanditfacilisisante.' +
          'Sedmollisnislalacusauctorsuscipit.Inhachabitasseplateadictumst.Phasellussitametvelittemporvenenatisfeliseuegestasrisus.' +
          'Aliquameteratsitametnibhcommodofinibus.Morbiefficiturodiovelpulvinariaculis.' +
          'Aeneantemporipsummassaaconsecteturturpisfaucibusultrices.Praesentsodalesmaurisquisportafermentum.' +
          'Etiamnisinislvenenatisvelauctorutullamcorperinjusto.Proinvelligulaerat.Phasellusvestibulumgravidamassanonfeugiat.' +
          'Maecenaspharetraeuismodmetusegetefficitur.Suspendisseamet@gmail.com',
      ),
    ).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailAtTLD", () => {
    expect(isEmail('test@com', false, true)).toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testValidator359", () => {
    expect(isEmail('abc@.com', false, true)).toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testValidator374", () => {
    expect(isEmail('abc@school.school')).toBeTruthy();
  });

  it('should return false if email is empty', () => {
    expect(isEmail('')).toBeFalsy();
    expect(isEmail(null)).toBeFalsy();
    expect(isEmail(undefined)).toBeFalsy();
  });
});
