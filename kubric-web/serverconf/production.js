module.exports = {
  root: 'https://app.kubric.io',
  studioRoot: 'https://studio.kubric.io',
  loglevel: "info",
  certificates: {
    key: '/home/deploy/letsencrypt/live/kubric.io/privkey.pem',
    cert: '/home/deploy/letsencrypt/live/kubric.io/fullchain.pem',
    caChain: ['/home/deploy/letsencrypt/live/kubric.io/chain.pem', '/home/deploy/letsencrypt/live/kubric.io/root.pem'],
  },

  //api endpoints
  api: {
    host: 'http://raydio-test.appspot.com',
    token: 'YjX8Mwc0IOTQzmTNXga5v/lwTRdQmvDmrrmER9ng8DoXN5XfboUTJF2G+H31oouYG3oElURZQ/622kkFzPN8U    LcJ7PmYvh4DkMThVpHPbLg=',
    resources: {
      upload: {
        host: 'https://raydio-1123.appspot.com'
      }
    }
  },

  //Cookie settings
  cookie: {
    name: 'uid',
    props: {
      domain: 'kubric.io',
      httpOnly: true,
    },
  },

  newrelic: {
    appName: "production",
  },

  firebase: {
    serviceAccount: {
      type: "service_account",
      project_id: "kubric-49de2",
      private_key_id: "dcf968d64a6e064e45d5f599e44ce93b73c38fe8",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCfFgVFZ7+g2mKl\nn+Utyr2D3/PK95/+CGmwsR1i6rBJq54gLrGXVZVTLhOaetj/NurQkzwrNE03Lsfw\nDMBgJTIovevzbuTJR4VddFzCn3bDtMgY8Bt6orVINL4UmCmYbB+fSqW9vUGcDFJf\nOef2J52xZGP3jqgQE2Sd+ccWSKBUJ8BiKsyifF2yxG5Ky7bmeFYtXR/DRrk0cvrj\nK/AeBabhf97pS9RCxwEwzhsMoLuBsIz6vAd1VHJ8dFfjUlW1TboWezaXJI4SGbYD\nio2ETiWD3YYgBsvsIZJL/pAkzMiGJPGA3uvj+QND1qxeO/GOjRFDBaLpy74vKs6Z\n7gym+v2lAgMBAAECggEAA3V9R0uLWwomT/AkH+aYbGSPqwwH1gRTXb5pcaiIxilK\nCiVtUL7fklpeSNv37xmG+A040dr/NbA5wlUDwY/Z7BD3S8Uy/ChDVK7pETA9o+Fd\nN7/QSgdhFHLjWSK6fwWG0H0cSm+q1Vx7cjzvIkNmIr0YjcisqHYn7Z66TQofi6FJ\n9/pOXY7p3PpUhDAlDez8PlZmbnUm6y3nsO7KCAiixMxnWXiACChnj9MbLRxEMbjq\nvQkM4a/B2ThKVbV3y/vUwU41kUzNziD9qVwaNZMocgRTItz/3Zke6chN9qYYn42u\nT5GxEigCisiwc7HZ/BfvfUARdpVed5IA3bOrFMSVlwKBgQDM62y30zcZszupM/zV\nZYXw9CkLs6dtniUz1somxCsdF+p8hOCZOJAhpvnF/k4jbYZLbn+iS/E934GzhfUa\ncNlzEmVAP7B+6cPAr1kIcRutUeikSgxweK4tNkC3FMnyg9kH4H0ASauU74+NMicq\ndu1QhwTXUawtb7HVwlnIRMDumwKBgQDGvc6ZD5jjww4iugG62uCorR2feERU5k/6\nBR6SVpHiAqnJ5ZGYwxeInQ/3y6P+UKtTeNneYxJ2uH13a73+yrbWRvRHkw/4yt8S\n1tsXwyd8pShOYl1lfoMVMf0DQpp/KITEqYjXMvxUmwVQtVBZ83pCfhnrNNfxg34f\npqBu0u5ovwKBgHeXAWi6fFKkVjImI+zKBgQcCgRJQXHotF9vf6RmIZ8mAPPQfF8P\nMpZhIy2YfzOPzKsi/pvR5CUu1jvV9rgKmezdFHgNc0xt0o8WBki18egRgEq46E+P\nLl82ZUgzerPsnHFLYsgTNm6B7G4DkfXnWBIB6iJbCLevksJkXQ9SiKH3AoGBAIcm\nVlNCBw+D+p3k7f46kCJEr2tdpuIxSNvWFWcglc4jT4Erq2o96UgOvugcxKXSB+AY\nw9f2eXzgkvnd+/NDuThYQhBWUrs2gqJWF+G95aFe0t0TCT5W3R9RwiQwa83jKP5v\n582oL239iYzL8Btrdo23ITsQ0XS8nc06S8lxiY0TAoGAVko6BG5VFuhTQidUI3o6\nvV7tuMRk7yrgSe/TW0ijQttV2rEYDIP/f3pGFRdzOAPu3r1vMW5oZ2anwbfDVFu3\nm7sMRvOxaZhlf5MWFA/HrshQ3QEXAZFqOvgSnSncua551rNFjhvXjcF0e0srR5Cv\nWVSR/sN+6r3dlOq1Dfx8GFY=\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-jgbmk@kubric-49de2.iam.gserviceaccount.com",
      client_id: "118201477452578277050",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://accounts.google.com/o/oauth2/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jgbmk%40kubric-49de2.iam.gserviceaccount.com"
    },
    config: {
      apiKey: "AIzaSyBPQEXVaFEOy5efnB_8XPsbEUBm7xe_XlY",
      authDomain: "kubric-49de2.firebaseapp.com",
      databaseURL: "https://kubric-49de2.firebaseio.com",
      projectId: "kubric-49de2",
      storageBucket: "kubric-49de2.appspot.com",
      messagingSenderId: "166504583105"
    },
  },
  intercom: {
    appId: 'tl6118ma'
  },
  sendbird: {
    appId: 'A6F6C0CD-342C-4FB3-992F-D8378E3A2705'
  },
  twilio: {
    serviceSid: "ISfd0c61a804a045af9386b33c5af2fee3",
  }
};
