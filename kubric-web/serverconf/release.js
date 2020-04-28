module.exports = {
  root: "https://app.beta.kubric.io",
  studioRoot: 'https://studio.beta.kubric.io',
  loglevel: "debug",
  algolia: {
    index: 'raydio_test',
  },

  //api endpoints
  api: {
    host: 'http://raydio-test.appspot.com',
    token: 'YjX8Mwc0IOTQzmTNXga5v/lwTRdQmvDmrrmER9ng8DoXN5XfboUTJF2G+H31oouYG3oElURZQ/622kkFzPN8U    LcJ7PmYvh4DkMThVpHPbLg=',
  },

  newrelic: {
    appName: "beta",
  },

  cookie: {
    name: 'beta-uid',
    props: {
      domain: 'beta.kubric.io',
      httpOnly: true,
    },
  },

  firebase: {
    serviceAccount: {
      type: "service_account",
      project_id: "kubric-beta",
      private_key_id: "937a2f3d613fef7c7777b5a5a0c948bc6c796dee",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1R+vf1UyIhA7F\nGowPojLvImeOYzSDN0L01tmNywfYA6c9fYFx/l85gAUK1JV9UuPt341PbiDubzSs\nI/wSUSYH3IFB3P8zR5kE4uI9XCyqovPsFv/XjqPwuH60WpCBLTXfCCOIJjjzWgC3\nFyGojeOjSm9OxJByZNArHImp5J+cpr82uhpkV8xzN60DCidMl1bbm7cfGfsuGjcB\n6ejU1eeHRgWTajAIwt8anGELqOOun9F6vl4vKKK8aixVzqWSKDpCUcI4F13QIKNo\nj7Yb957J5pGivdSxh29FtYUufvQ4AG1+oUInEyiG7rgWO6MtBwjgLsBuvpK3nRa9\nqSluI5yfAgMBAAECggEAUFuIUJlhqqY3UeIZshhpUZ3Dn9eUAJJviM7wcy1L1dKQ\nwO4wglKK7Zc1JP7lIT+sL9bH8izURj1fcOsmowv7usJhPcv0CEw1pXfZZ+/DEQTY\n8Y+ka24cd+mgqNv4cHqVBb+62HBxEFaWOJL1ZZ04CjtFqfnyOfM8X8/vqjLhGfQE\nxbKe0vzYLp4bb5iQ0sNsx+xvvm5m7Indif5+uEh9duQ9AqiM7Jd2oA3uefVwbce3\ne++a4g228wjVYmlgmh2agC+ObHWCY1ELfl3p18d/a7yUgLrupzf4O/Bb5M0ngo2K\nsZqD3QlCwlL+rNSv9QLKNuOBe8kXJ+Bstjvg1F/ecQKBgQDsJGZG+89StXNYOAlq\nlNXsBwcnJnqdwSHp1/x+kgh1AbofaGSxUPPsxT8i3/ZwsrXL8Hj7dJa8hykFTEgx\ndZcBkFFOdpo4DqlTQGcW6PknULySGYOc+wIysai6Ict5wDk1xUfM4TdBd5lxYWw5\nRX56y4IuNgHL7A4VQFN09jV51wKBgQDEhnwlNKIAr39ijR/XFKaAGYYxW2DZTnkf\n6jl5iMTHSmS/ctpIwGNQWFZ6s6+btipJL02VHovu9eyGu/1fYZcui6+xXGovalHK\n/CXD0O4Z0z3AtkDbyvD+5P4a2bkEuSwYpryJgCZd1Tg0gsfhl8cFnFs29gidKIek\nfWQqP6ZqeQKBgBFH6KQxMU7gMHy4PRgrpCwNp5xZ2IdK5uxx/exVS4EkizZZMWU4\ng2FEXgZzVVmR+nPeOTxNn+pUCdB1cKMN8+sNYKXZUBfiGsoY4HJwwir6YZJfg54t\nUE/daHeWmYljY8xnj4WSxbRoyDXf50eZqlPaKMCw+xitQaqUdocMrYUpAoGBAMMn\nqXBo69cyb5U1/0BeSVk7/35T98DTpISE275Mitw8i/9x1kIYiobmsjn25ZQDOcqj\nJq/GPb92hwLk+58UEkUugbHmy6t6MO8ZpYbmmwsaMmCEm7Onu9njHFMdkhWWrKtu\nKBuDHpZffgjnNgZX6lMwCYRynesyrEA0JJuvyVpBAoGAeIhY+uELLlO8CJh1I1BK\n/S/xEQnGmLDnafry0xL6pW69pT5Wj8XhTQcn3x3luLpOpM/+b3ugLaeeqypZJEmP\nLBSQ5eR4IeQ2hpkn4VfNkLlvFL2QijSGdVfgaFxvKX4dQDavqtAb1MVSAef2QYRD\n6hAllUBVNcNpGXFMhDuywVM=\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-4zrft@kubric-beta.iam.gserviceaccount.com",
      client_id: "117571079463658330113",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://accounts.google.com/o/oauth2/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4zrft%40kubric-beta.iam.gserviceaccount.com"
    },
    config: {
      apiKey: "AIzaSyCv025aRRa4vMfAImTRXm1ZEnOzAEnUAHc",
      authDomain: "kubric-beta.firebaseapp.com",
      databaseURL: "https://kubric-beta.firebaseio.com",
      projectId: "kubric-beta",
      storageBucket: "kubric-beta.appspot.com",
      messagingSenderId: "277473412365"
    },
  }
}
