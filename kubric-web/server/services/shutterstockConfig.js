export default {
    host: 'https://www.shutterstock.com/sstk/api/footage',
    "headers" : {},
    "resources" : {
      "shutterstock" : {
        "services" : {
          "getAssets" : {
            host: "https://www.shutterstock.com/sstk/api/footage",
            "method" : "get",
            "path" : "images/search",
            "query" : {
              "page[number]" : "{{page}}",
              "page[size]" : "{{size}}",
              "q" : "{{q}}"
            },
            "type" : "auto"
          }
        }
      }
    }
  }