// system wide config in one object

var config = {
  auth: {
    token: {
      issuer: "localhost",
      secret: "eShopApi_20170417",
      ttl: 60 * 60 * 4, // in seconds
    }
  },
  db: {
    mysql: {
      // host: "mysql-eshop.ckzoxzsvcc8g.ap-southeast-2.rds.amazonaws.com",
      host: "localhost",
      database: "eshop",
      port: 3306,
      username: "root",
      password: "5287895w",
      pollSize: 3,
      timeout: {
        short: 10000, // 10 seconds
        normal: 30000, // 30 seconds
        long: 60000, // 1 minute
        extraLong: 300000, // 5 minutes
      }
    }
  },
  aws: {
    s3: {
      bucket: "ecommerce.beta",
      accessKeyId: "AKIAIP2DG4KXNNMPN6HA",
      screctAccessKey: "NzrDRv0uQLGFmODO6M0XGPfJjqx0z+pJy8d3MdtD",
      region: "us-west-2",
      apiVersion: "2006-03-01"
    }
  },
  asset: {
    imageServer: {
      domain: "http://ecommerce.beta.s3-website-us-west-2.amazonaws.com",
      publicAssetPrefix: "public/",
      privateAssetPrefix: "private/",
      galleryThumbWidth: 150,
      galleryThumbHeight: 150
    }
  },
  appSettings: {
    defaultLimit: 50,
    maxLimit: 500,
    environment: 'development'
  },
  environments: {
    dev: 'development',
    prod: 'production',
    test: 'test'
  }
};

var betaConfig = {
  db: {
    mysql: {
      host: "mysql-eshop.ckzoxzsvcc8g.ap-southeast-2.rds.amazonaws.com"
    }
  },
  appSettings: {
    environment: 'production'
  }
}

var prodConfig = {
  db: {
    mysql: {
      pollSize: 5
    }
  },
  aws: {
    s3: {
      bucket: "ecommerce.prod"
    }
  },
  asset: {
    imageServer: {
      domain: "http://ecommerce.prod.s3-website-us-west-2.amazonaws.com"
    }
  },
  appSettings: {
    environment: 'production'
  }
}

if (process.env.NODE_ENV === "beta") {
  config = Object.assign(config, betaConfig);
} else if (process.env.NODE_ENV === "prod") {
  config = Object.assign(config, prodConfig);
}

module.exports = config;
