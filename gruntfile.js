module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		shell: {
			mongodFork: {
				command: "mongod --fork --logpath /var/log/mongodb.log"
			},
			mongod: {
				command: "mongod"
			},
			mongodShutdown: {
				command: 'mongo admin --eval "db.shutdownServer()"'
			},
			startImageServer: {
				command: "node ../asset/server.js"
			}
		},
		express: {
			options: {
				script: "server/server.js",
				port: 3000
			},
			dev: {
				options: {
					node_env: "dev"
				}
			},
			beta: {
				options: {
					node_env: "beta"
				}
			},
			prod: {
				options: {
					node_env: "prod"
				}
			}
		},
		watch: {
			express: {
				files: [
					"**/*.js",
					"**/*.json",
					"!node_modules/**/*.*"],
				tasks: ["express:dev"],
				options: {
					spawn: false,
					livereload: true,
					serverreload: true,
					port: 3000
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-express-server");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("mongod", ["shell:mongod"]);
	grunt.registerTask("mongod-fork", ["shell:mongodFork"]);
	grunt.registerTask("mongod-shutdown", ["shell:mongodShutdown"]);
	grunt.registerTask("start-full", ["shell:mongodFork", "express:dev", "watch:express"]);
	grunt.registerTask("default", ["express:dev", "watch"]);
	grunt.registerTask("start", ["express:dev", "watch"]);
	grunt.registerTask("start-beta", ["express:beta", "watch"]);
	grunt.registerTask("start-prod", ["css-minify", "js-minify", "express:prod", "watch"]);
};
