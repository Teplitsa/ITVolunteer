const appConfig = {
  BaseUrl: "https://itv.te-st.ru",
  GraphQLServer: `${this.BaseUrl}/graphql`,
  AjaxUrl: `${this.BaseUrl}/wp-admin/admin-ajax.php`,
  RestApiUrl: `${this.BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
};

module.exports = appConfig;
