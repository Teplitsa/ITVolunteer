const appConfig = {
  GraphQLServer: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000"
      : "https://itv.te-st.ru"
  }/graphql`,
  AjaxUrl: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000"
      : "https://itv.te-st.ru"
  }/wp-admin/admin-ajax.php`,
  RestApiUrl: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000"
      : "https://itv.te-st.ru"
  }//wp-json`,
  AuthTokenLifeTimeMs: 600,
};

module.exports = appConfig;
