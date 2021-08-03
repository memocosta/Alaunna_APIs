/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

  oneSignal: {
    userAuth: 'ZDU0OTA5ODQtZTJhYy00N2NiLTk3ODUtZWE4MGJiZTdjM2Y0',
    admin: {
      appId: '1eb3fb48-4838-42f1-900e-95b5abf99ebb',
      appAuthKey: 'NTEwMzI5ODYtZTc1Yi00YTBkLTgyMDEtNDllYjI3N2MwYzlh'
    },
    user: {
      appId: '71526830-2514-4982-80e4-fa16933ec33b',
      appAuthKey: 'ODhjMWQ0MWMtNDM0Zi00NjI1LWE3MmUtMzBmNWRlZGUyNjJm'
    },
    seller: {
      appId: '44f6d1b5-7d2b-4363-9d0f-72ff6eea1496',
      appAuthKey: 'YzFjMjE1ZWQtODI2YS00NGU3LWFjNTEtOGVhM2RiMTc3YTBm'
    }
  }

};
