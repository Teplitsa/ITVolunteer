const BaseUrl = "http://172.16.0.46";

const appConfig = {
  BaseUrl,
  GraphQLServer: `${BaseUrl}/graphql`,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
  MongoConnection: "mongodb://mongo:27017",
};

module.exports = appConfig;
