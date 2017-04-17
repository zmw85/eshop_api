var config = {
    auth: {
        token: {
            issuer: "localhost",
            secret: "eShopApi_20170417",
            ttl: 60 * 60 * 4, // in seconds
        }
    },
	db: {
	    dbURI: "mongodb://localhost/trade" // local mongod
		//dbURI: "mongodb://appUser_ecommerce:901166@192.168.2.2/ecommerce"	// mongod on ubuntu server
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
		imageServerDomain: "http://ecommerce.beta.s3-website-us-west-2.amazonaws.com",
		publicAssetPrefix: "public/",
		privateAssetPrefix: "private/",
		galleryThumbWidth: 150,
		galleryThumbHeight: 150
	},
	versions: {
		css: "201703111200",
		js: "201703111200"
	}
};

if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "beta") {
	
} else if (process.env.NODE_ENV == "prod") {
	config.aws.s3.bucket = "ecommerce.prod";
	config.db.dbURI = "mongodb://localhost/trade";
	config.asset.imageServerDomain = "http://ecommerce.prod.s3-website-us-west-2.amazonaws.com";
}

module.exports = config;
