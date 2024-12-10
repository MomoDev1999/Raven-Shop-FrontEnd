module.exports = function (config) {
  console.log("Usando karma.conf.js configurado!");
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // Deja Jasmine Spec Runner visible en el navegador
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage/mi-tienda"),
      subdir: ".",
      reporters: [
        { type: "html", subdir: "html-report" },
        { type: "lcov", subdir: "lcov-report" },
      ],
    },
    reporters: ["progress", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
};
