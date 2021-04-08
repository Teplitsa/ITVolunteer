const BaseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:9000" : "https://itv.te-st.ru";

const appConfig = {
  BaseUrl,
  GraphQLServer: `${BaseUrl}/graphql`,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
};

module.exports = appConfig;
