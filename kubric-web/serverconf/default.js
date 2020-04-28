import path from 'path';

module.exports = {
  app: 'kubric',
  appName: 'kubric.storeo',
  root: 'http://app.dev.kubric.io',
  studioRoot: 'http://studio.dev.kubric.io',
  loglevel: "debug",

  fetchLimits: {
    limit: 30,
    objects: {
      audience: 10,
      ads: 10,
    },
  },

  workerCount: {
    creative: 10,
  },

  newrelic: {
    appName: "dev",
    licenseKey: "22e416c648bf7481bf0edbdf9876ec515d8c956f"
  },

  paths: {
    assets: path.resolve(__dirname, '../dist/assets'),
    spreadsheets: path.resolve(__dirname, '../temp/spreadsheets'),
    templates: path.resolve(__dirname, '../dist/assets/templates'),
    appManifest: path.resolve(__dirname, '../dist/assets/app-manifest.json'),
    loginManifest: path.resolve(__dirname, '../dist/assets/login-manifest.json')
  },

  //nodes where redis masters will be started
  redis: {
    cachePrefix: 'kubric',
    nodes: [{
      host: '127.0.0.1',
      port: 7000
    },
      {
        host: '127.0.0.1',
        port: 7001
      },
      {
        host: '127.0.0.1',
        port: 7002
      },
      {
        host: '127.0.0.1',
        port: 7003
      },
      {
        host: '127.0.0.1',
        port: 7004
      },
      {
        host: '127.0.0.1',
        port: 7005
      },
    ],
    entities: {
      session: {
        name: 'Session',
        expiry: 1000 * 60 * 60 * 24 * 7, //7 days
      },
      creative: {
        name: 'Creative',
        expiry: 1000 * 60 * 60 * 24, //1 day
      }
    },
  },

  certificates: {
    key: '/usr/local/etc/nginx/nginx.key',
    cert: '/usr/local/etc/nginx/nginx.crt',
  },

  slack: {
    authState: 'ra-creator-studio',
    clientId: '19558525027.61807483184',
    clientSecret: '5396b9281852353b1793202998eae40c',
    redirectUri: 'https://studio.raydio.in/api/slack',
    supportchannel: 'studio_support',
    accesstoken: 'xoxp-19558525027-60081152850-68279022723-c3caf02888',
    bottoken: 'xoxb-68072648116-7fFwvEhGFdU3PKuAKIXiaC0v',
    leadsChannel: {
      webhook: 'https://hooks.slack.com/services/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'
    }
  },

  chat: {
    welcomeMessage: 'Hi! How may we help you today?',
    historyCount: 15,
  },

  //Cookie settings
  cookie: {
    name: 'dev-uid',
    props: {
      domain: 'dev.kubric.io',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  },

  //api endpoints
  api: {
    apiHost: "http://api.kubric.io",
    host: 'http://raydio-test.appspot.com',
    token: 'YjX8Mwc0IOTQzmTNXga5v/lwTRdQmvDmrrmER9ng8DoXN5XfboUTJF2G+H31oouYG3oElURZQ/622kkFzPN8U    LcJ7PmYvh4DkMThVpHPbLg=',
  },

  firebase: {
    serviceAccount: {
      type: "service_account",
      project_id: "kubric-dev",
      private_key_id: "f9198baec48bcb04d9d405541c5eb46911cac5f1",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCl7yX28+KfXJ6X\ns1KFZizURBdpj0G1gzKSubOTLHaXE07G9T9unvQxobUn5Hq//Pif51ubkizM3YO1\nmjG1Hv/hofmwn0aKgdQKejv1fRnMBnwtK9vLaf5G7H+1AgmyH19UTjXpgqgsVy16\nKiJ06xlLMKjjkqUBXiTxkeujA6lX2krxS2fU+vU0meNAvP7QPu+05KBTVWI7K1H3\ndrXWdELkkSIU32LZY4jnI7HEqNoOu+3HkWFHObC6kFVrT2KBkmG0yNeymd7Yjjwp\nknSe5kirJu244q87qxp5lDx5Jns4M5K6r6HD8KATHRl9LcVkutUQ9ZdS1UxoNr8c\nWhx4j5cdAgMBAAECggEANlGGdoRYu704h0Vi7ptHcocFuP71ziLwE7rpj3R/L65Y\n2+VdietL2dFrOW9gRWfcxY+ZW+BqfPfIjVK4EeffcK+yyoAhOecNEA76gL6eirzW\nunzAeyKr4/C4T3smzGHbtX/SwymLvtQc5YBUfjyVr5jyuGiBTmTQqCmR3u+saD7c\nZArr6ynRNzYqVU5UqwVpeVjFGMR/h4+nQ+1RIkxR28BXm2JYkss/LH0CcQVN8Tgo\njq5nBOuR+qyZI9v1MElJebh1JY8TKdfVWidNqjTGa/LLnOFdIzuAM54E5VYYexBf\nn8TmZI8+DmERX8sKVuzlW8bQQnQl2ItHAhb7JzXqiwKBgQDft+HwZPJXQccQnyGK\naK5dkg+zlgVO0Sli4c4lY0mwkJ266Ljn7ZWB/2QWa+eQCh10riGr0aEVbIJmDJ3C\nzNtA4qZUA5lpCpKGr/1E3Yie2zuJjy8UoHonFqI5v6EGZvsTKVGPVqDhpzpHY/7D\nNmqi8/zOV8r0bCDYB5nUHAU5rwKBgQC94LrRm1EoZ39si/D6L0z6Rr8bOSTmRARx\nHwTMSRLuThPVAUzcysn22M5yMjWOgYe8359cKZhbdipikER2UGurCcc33lMXkQG6\nBX+vksBMVws0DcRnsyaNVf7izmRQsFj9McqicDQeOOtr1IFopey4ff7H50rxt+yM\niWNjlXcK8wKBgQC2v3/6Hov0CVByXHtKk+5zkx/uZEsbsjJriucZlXyZldiy2O5K\nzsIFejkpM6Xp/MlJCgGJWGmMlaIDeKTafvtPipWyJWqI6tD84wAx5AF5Or7sxKEB\n6YE/Mvb703TXRQIuCd+NBofPLQqnTKDMmEQNrt9BM2gft8AwmCzpnqYKEwKBgE2I\nm6CFpJE0GfMv/ZmbgPpdsyGhpvCj65BpkyL739ARb8W1vzYVVH0IsNwupnHncI7u\nXXtbvMv0J4CR2nLZie2Qk5m7ngBshOD559bAvOcvT/LUgFO78s0ZxXfFwW61Y9EX\n6N+Fo7KHmZIxdxpNTqlTQZtNVev4J46Hd18tpCuDAoGBAIgwi+LUFwReT7v5ygIR\nZdy6CcNNdCJozSbUKjyx2/o+Co82DlW9aJlyw3CF6bLZ7xcZlRKXzxS4uE3FpwVp\npNpKBSq6fETZrZjLOFYA5EFujEHr7B8E+h6m91ZlNDR8SyXLHXMZ0w92HLbOrYkt\nCuRmgMlhISjRlQ7hCegIF+R3\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-mnqza@kubric-dev.iam.gserviceaccount.com",
      client_id: "116105940687046986470",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://accounts.google.com/o/oauth2/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mnqza%40kubric-dev.iam.gserviceaccount.com"
    },
    config: {
      apiKey: "AIzaSyDxIlAu4L_BCKa4ZLW1nSvlI9gTCXDg7ys",
      authDomain: "kubric-dev.firebaseapp.com",
      databaseURL: "https://kubric-dev.firebaseio.com",
      projectId: "kubric-dev",
      storageBucket: "kubric-dev.appspot.com",
      messagingSenderId: "485846627563"
    },
    loginConfig: {
      apiKey: "AIzaSyBPQEXVaFEOy5efnB_8XPsbEUBm7xe_XlY",
      authDomain: "kubric-49de2.firebaseapp.com",
      databaseURL: "https://kubric-49de2.firebaseio.com",
      projectId: "kubric-49de2",
      storageBucket: "kubric-49de2.appspot.com",
      messagingSenderId: "166504583105"
    },
    refs: {
      featuregates: "feature-gates/kubric",
      config: {
        server: {
          services: "config/server/services"
        }
      },
      chat: {
        mentions: "chat/mentions/{{channelId}}/{{user}}"
      },
      campaigns: {
        ad: "campaigns/{{campaign}}/ads/{{ad}}"
      },
      generation: {
        logPath: "campaigns/{{campaign}}",
        creative: "creative-generation/campaigns/{{campaign}}/{{creative}}"
      }
    }
  },
  sendbird: {
    appId: '398E5FC7-25F7-4550-8AE2-DD95100E9E2E'
  },
  twilio: {
    appName: "KubricChat",
    authToken: '9b3464ce36db383a39df56a3332b753a',
    accountSid: "AC6e9a9bae1a5da8227be7803e2363c4fe",
    serviceSid: "ISff5f4989ab85493088f6ffc06d4219ed",
    apiKey: 'SKf5d4c76ab2805345169c8663eb916f55',
    apiSecret: 'GjJbVXsJSLlXmhLlOzD0ZGwexVfzgtyQ',
  }
};