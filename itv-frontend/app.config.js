const appConfig = {
  GraphQLServer: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000"
      : "https://itv.ngo2.ru"
  }/graphql`,
  AjaxUrl: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000"
      : "https://itv.ngo2.ru"
  }/wp-admin/admin-ajax.php`,
  AuthTokenLifeTimeMs: 600,
};

module.exports = appConfig;
