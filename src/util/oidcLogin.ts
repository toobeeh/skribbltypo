export class OidcLogin {

  private static _oidcConfig?: Record<string, string>;

  private readonly config = {
    issuer: "https://api.typo.rip/openid",
    redirectUri: "https://skribbl.io",
    clientId: "1"
  };

  private async getOidcConfig(): Promise<Record<string, string>> {
    if(OidcLogin._oidcConfig) return OidcLogin._oidcConfig;

    const response = await fetch(this.config.issuer + "/.well-known/openid-configuration");
    if(!response.ok) throw new Error("Failed to fetch OIDC configuration");
    OidcLogin._oidcConfig = await response.json() as Record<string, string>;
    return OidcLogin._oidcConfig;
  }

  public async loginRedirect() {
    const oidcConfig = await this.getOidcConfig();

    const authUrl = new URL(oidcConfig.authorization_endpoint);
    authUrl.searchParams.append("client_id", this.config.clientId);
    authUrl.searchParams.append("redirect_uri", this.config.redirectUri);
    authUrl.searchParams.append("response_type", "code");

    window.location.href = authUrl.toString();
  }

  public hasRedirectCallback(): boolean {
    const state = new URLSearchParams(window.location.search);
    return state.has("code");
  }

  public async exchangeAuthCode(): Promise<string> {
    const oidcConfig = await this.getOidcConfig();

    const state = new URLSearchParams(window.location.search);
    const code = state.get("code");
    if(!code) throw new Error("No code found in URL");

    const tokenResponse = await fetch(oidcConfig.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId
      })
    });

    if(!tokenResponse.ok) throw new Error("Failed to exchange code for token");
    this.clearUrlParams();

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  }

  public clearUrlParams() {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState({}, document.title, url.toString());
  }

  public async exchangeLegacyToken(token: string): Promise<string> {
    const oidcConfig = await this.getOidcConfig();

    const tokenResponse = await fetch(oidcConfig.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "typo-legacy-token",
        subject_token: token,
        client_id: this.config.clientId
      })
    });

    if(!tokenResponse.ok) throw new Error("Failed to exchange code for token");
    this.clearUrlParams();

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  }

}