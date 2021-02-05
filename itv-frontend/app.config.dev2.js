const BaseUrl = "https://itv2.ngo2.ru";

const appConfig = {
  BaseUrl,
  GraphQLServer: `${BaseUrl}/graphql`,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
  MongoConnection: "mongodb://localhost:27017",
};

module.exports = appConfig;
