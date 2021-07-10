import isEmail from '../src/isEmail';

describe('email validator', () => {
  it("should pass Apache's EmailValidatorTest#testEmail", async () => {
    expect(isEmail('jsmith@apache.org')).resolves.toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithNumericAddress", async () => {
    expect(isEmail('someone@[216.109.118.76]')).resolves.toBeTruthy();
    expect(isEmail('someone@yahoo.com')).resolves.toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailExtension", async () => {
    expect(isEmail('jsmith@apache.org')).resolves.toBeTruthy();
    expect(isEmail('jsmith@apache.com')).resolves.toBeTruthy();
    expect(isEmail('jsmith@apache.net')).resolves.toBeTruthy();
    expect(isEmail('jsmith@apache.info')).resolves.toBeTruthy();
    expect(isEmail('jsmith@apache.')).resolves.toBeFalsy();
    expect(isEmail('jsmith@apache.c')).resolves.toBeFalsy();
    expect(isEmail('someone@yahoo.museum')).resolves.toBeTruthy();
    expect(isEmail('someone@yahoo.mu-seum')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithDash", async () => {
    expect(isEmail('andy.noble@data-workshop.com')).resolves.toBeTruthy();
    expect(isEmail('andy-noble@data-workshop.-com')).resolves.toBeFalsy();
    expect(isEmail('andy-noble@data-workshop.c-om')).resolves.toBeFalsy();
    expect(isEmail('andy-noble@data-workshop.co-m')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithDotEnd", async () => {
    expect(isEmail('andy.noble@data-workshop.com.')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithBogusCharacter", async () => {
    expect(isEmail('andy.noble@\u008fdata-workshop.com')).resolves.toBeFalsy();

    // The ' characteris valid in an email username.
    expect(isEmail("andy.o'reilly@data-workshop.com")).resolves.toBeTruthy();

    // But not in the domain name.
    expect(isEmail("andy@o'reilly.data-workshop.com")).resolves.toBeFalsy();

    // The + character is valid in an email username.
    expect(isEmail('foo+bar@i.am.not.in.us.example.com')).resolves.toBeTruthy();

    // But not in the domain name
    expect(isEmail('foo+bar@example+3.com')).resolves.toBeFalsy();

    // Domains iwth only special characters aren't allowed (VALIDATOR-286)
    expect(isEmail('test@%*.com')).resolves.toBeFalsy();
    expect(isEmail('test@^&#.com')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testVALIDATOR_315", async () => {
    expect(isEmail('me@at&t.net')).resolves.toBeFalsy();
    expect(isEmail('me@att.net')).resolves.toBeTruthy(); // Make sure TLD is not the cause of the failure
  });

  it("should pass Apache's EmailValidatorTest#testVALIDATOR_278", async () => {
    expect(isEmail('someone@-test.com')).resolves.toBeFalsy(); // hostname starts with a dash/hyphen
    expect(isEmail('someone@test-.com')).resolves.toBeFalsy(); // hostname ends iwth a dash-hyphen
  });

  it("should pass Apache's EmailValidatorTest#testValidator235", async () => {
    expect(isEmail('someone@xn--d1abbgf6aiiy.xn--p1ai')).resolves.toBeTruthy();
    expect(isEmail('someone@президент.рф')).resolves.toBeTruthy();
    expect(isEmail('someone@www.b\u00fccher.ch')).resolves.toBeTruthy();
    expect(isEmail('someone@www.\uFFFD.ch')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithCommas", async () => {
    expect(isEmail('jowblow@apa,che.org')).resolves.toBeFalsy();
    expect(isEmail('jowblow@apache.o,rg')).resolves.toBeFalsy();
    expect(isEmail('jowblow@apache,org')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithSpaces", async () => {
    expect(isEmail('joeblow @apache.org')).resolves.toBeFalsy();
    expect(isEmail('joeblow@ apache.org')).resolves.toBeFalsy();
    expect(isEmail(' joeblow@apache.org')).resolves.toBeFalsy();
    expect(isEmail('joeblow@apache.org ')).resolves.toBeFalsy();
    expect(isEmail('joe blow@apache.org')).resolves.toBeFalsy();
    expect(isEmail('joeblow@apa che.org')).resolves.toBeFalsy();
    expect(isEmail('"joeblow "@apache.org')).resolves.toBeTruthy();
    expect(isEmail('" joeblow"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('" joeblow "@apache.org')).resolves.toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithControlChars", async () => {
    for (let c = 0; c < 32; c++) {
      expect(
        isEmail('foo' + String.fromCharCode(c) + 'bar@domain.com'),
      ).resolves.toBeFalsy();
    }

    expect(
      isEmail('foo' + String.fromCharCode(127) + 'bar@domain.com'),
    ).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailLocalhost", async () => {
    expect(isEmail('joe@localhost.localdomain', true)).resolves.toBeTruthy();
    expect(isEmail('joe@localhost', true)).resolves.toBeTruthy();

    expect(isEmail('joe@localhost.localdomain')).resolves.toBeFalsy();
    expect(isEmail('joe@localhost')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailWithSlashes", async () => {
    expect(isEmail('joe!/blow@apache.org')).resolves.toBeTruthy();
    expect(isEmail('joe@ap/ache.org')).resolves.toBeFalsy();
    expect(isEmail('joe@apac!he.org')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailUserName", async () => {
    expect(isEmail('joe1blow@apache.org')).resolves.toBeTruthy();
    expect(isEmail('joe$blow@apache.org')).resolves.toBeTruthy();
    expect(isEmail('joe-@apache.org')).resolves.toBeTruthy();
    expect(isEmail('joe_@apache.org')).resolves.toBeTruthy();
    expect(isEmail('joe+@apache.org')).resolves.toBeTruthy(); // + is valid unquoted
    expect(isEmail('joe!@apache.org')).resolves.toBeTruthy(); // ! is valid unquoted
    expect(isEmail('joe*@apache.org')).resolves.toBeTruthy(); // * is valid unquoted
    expect(isEmail("joe'@apache.org")).resolves.toBeTruthy(); // ' is valid unquoted
    expect(isEmail('joe%45@apache.org')).resolves.toBeTruthy(); // % is valid unquoted
    expect(isEmail('joe?@apache.org')).resolves.toBeTruthy(); // ? is valid unquoted
    expect(isEmail('joe&@apache.org')).resolves.toBeTruthy(); // & ditto
    expect(isEmail('joe=@apache.org')).resolves.toBeTruthy(); // = ditto
    expect(isEmail('+joe@apache.org')).resolves.toBeTruthy(); // + is valid unquoted
    expect(isEmail('!joe@apache.org')).resolves.toBeTruthy(); // ! is valid unquoted
    expect(isEmail('*joe@apache.org')).resolves.toBeTruthy(); // * is valid unquoted
    expect(isEmail("'joe@apache.org")).resolves.toBeTruthy(); // ' is valid unquoted
    expect(isEmail('%joe45@apache.org')).resolves.toBeTruthy(); // % is valid unquoted
    expect(isEmail('?joe@apache.org')).resolves.toBeTruthy(); // ? is valid unquoted
    expect(isEmail('&joe@apache.org')).resolves.toBeTruthy(); // & ditto
    expect(isEmail('=joe@apache.org')).resolves.toBeTruthy(); // = ditto
    expect(isEmail('+@apache.org')).resolves.toBeTruthy(); // + is valid unquoted
    expect(isEmail('!@apache.org')).resolves.toBeTruthy(); // ! is valid unquoted
    expect(isEmail('*@apache.org')).resolves.toBeTruthy(); // * is valid unquoted
    expect(isEmail("'@apache.org")).resolves.toBeTruthy(); // ' is valid unquoted
    expect(isEmail('%@apache.org')).resolves.toBeTruthy(); // % is valid unquoted
    expect(isEmail('?@apache.org')).resolves.toBeTruthy(); // ? is valid unquoted
    expect(isEmail('&@apache.org')).resolves.toBeTruthy(); // & ditto
    expect(isEmail('=@apache.org')).resolves.toBeTruthy(); // = ditto

    // UnQuoted Special characters are invalid
    expect(isEmail('joe.@apache.org')).resolves.toBeFalsy(); // . not allowed at end of local part
    expect(isEmail('.joe@apache.org')).resolves.toBeFalsy(); // . not allowed at start of local part
    expect(isEmail('.@apache.org')).resolves.toBeFalsy(); // . not allowed alone
    expect(isEmail('joe.ok@apache.org')).resolves.toBeTruthy(); // . allowed embedded
    expect(isEmail('joe..ok@apache.org')).resolves.toBeFalsy(); // .. not allowed embedded
    expect(isEmail('..@apache.org')).resolves.toBeFalsy(); // .. not allowed alone
    expect(isEmail('joe(@apache.org')).resolves.toBeFalsy();
    expect(isEmail('joe)@apache.org')).resolves.toBeFalsy();
    expect(isEmail('joe,@apache.org')).resolves.toBeFalsy();
    expect(isEmail('joe;@apache.org')).resolves.toBeFalsy();

    // Quoted Special characters are valid
    expect(isEmail('"joe."@apache.org')).resolves.toBeTruthy();
    expect(isEmail('".joe"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe+"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe@"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe!"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe*"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe\'"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe("@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe)"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe,"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe%45"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe;"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe?"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe&"@apache.org')).resolves.toBeTruthy();
    expect(isEmail('"joe="@apache.org')).resolves.toBeTruthy();
    expect(isEmail('".."@apache.org')).resolves.toBeTruthy();

    // escaped quote character valid in quoted string
    expect(isEmail('"john\\"doe"@apache.org')).resolves.toBeTruthy();
    expect(
      isEmail(
        'john56789.john56789.john56789.john56789.john56789.john56789.john@example.com',
      ),
    ).resolves.toBeTruthy();
    expect(
      isEmail(
        'john56789.john56789.john56789.john56789.john56789.john56789.john5@example.com',
      ),
    ).resolves.toBeFalsy();
    expect(
      isEmail('\\>escape\\\\special\\^characters\\<@example.com'),
    ).resolves.toBeTruthy();
    expect(isEmail('Abc\\@def@example.com')).resolves.toBeTruthy();
    expect(isEmail('Abc@def@example.com')).resolves.toBeFalsy();
    expect(isEmail('space\\ monkey@example.com')).resolves.toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testValidator293", async () => {
    expect(isEmail('abc-@abc.com')).resolves.toBeTruthy();
    expect(isEmail('abc_@abc.com')).resolves.toBeTruthy();
    expect(isEmail('abc-def@abc.com')).resolves.toBeTruthy();
    expect(isEmail('abc_def@abc.com')).resolves.toBeTruthy();
    expect(isEmail('abc@abc_def.com')).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidaotrTest#testValidator365", async () => {
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
    ).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testEmailAtTLD", async () => {
    expect(isEmail('test@com', false, true)).resolves.toBeTruthy();
  });

  it("should pass Apache's EmailValidatorTest#testValidator359", async () => {
    expect(isEmail('abc@.com', false, true)).resolves.toBeFalsy();
  });

  it("should pass Apache's EmailValidatorTest#testValidator374", async () => {
    expect(isEmail('abc@school.school')).resolves.toBeTruthy();
  });

  it('should return false if email is empty', async () => {
    expect(isEmail('')).resolves.toBeFalsy();
    expect(isEmail(null)).resolves.toBeFalsy();
    expect(isEmail(undefined)).resolves.toBeFalsy();
  });
});
