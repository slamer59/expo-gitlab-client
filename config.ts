export const config = {
  issuer: "https://gitlab.com",
  clientId: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",
  redirectUrl: "git-test-check://oauthredirect",
  scopes: ["api", "read_user"],
  serviceConfiguration: {
    authorizationEndpoint: "https://gitlab.com/oauth/authorize",
    tokenEndpoint: "https://gitlab.com/oauth/token",
    revocationEndpoint: "https://gitlab.com/oauth/revoke",
  },
};
