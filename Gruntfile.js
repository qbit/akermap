module.exports = function(grunt) {
  'use strict';

  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webpack: {
        options: webpackConfig,
        build: {
            stats: {
                // Configure the console output
                colors: false,
                modules: true,
                reasons: false
            },
            plugins: webpackConfig.plugins.concat(
                new webpack.DefinePlugin({
                    "process.env": {
                        // This can have an effect on library size
                        "NODE_ENV": JSON.stringify("production")
                    },
                    "DEBUG": false
                }),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin()
            )
        }
    },
    "webpack-dev-server": {
        options: {
            webpack: webpackConfig,
            publicPath: "/" + webpackConfig.output.publicPath,
            contentBase: 'client/',
        },
        start: {
            plugins: webpackConfig.plugins.concat(
                new webpack.HotModuleReplacementPlugin(),
                new webpack.DefinePlugin({
                    "DEBUG": true
                })
            ),
            keepAlive: true,
            webpack: {
                cache: true,
                watch: true,
                inline: true,
                devtool: "eval",
                debug: true
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-webpack');

  // Default task(s).
  grunt.registerTask("default", ["webpack-dev-server:start"]);
  grunt.registerTask("build", ["webpack:build"]);
};
