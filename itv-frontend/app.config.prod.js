const BaseUrl = "https://itv.te-st.ru";

const appConfig = {
  BaseUrl,
  GraphQLServer: `${BaseUrl}/graphql`,
  AjaxUrl: `${BaseUrl}/wp-admin/admin-ajax.php`,
  LoginUrl: `${BaseUrl}/itv-protected-99xkQ2bZJH5e-login.php`,
  RestApiUrl: `${BaseUrl}/wp-json`,
  AuthTokenLifeTimeMs: 600,
};

module.exports = appConfig;
