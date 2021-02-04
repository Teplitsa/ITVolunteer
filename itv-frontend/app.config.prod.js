const BaseUrl = "https://itv.te-st.ru";

const appConfig = {
  BaseUrl,
  GraphQLServer: `${BaseUrl}/graphql`,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
  MongoConnection: "mongodb://localhost:27017",
};

module.exports = appConfig;
