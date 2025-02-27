import { ApiService } from "../../abstractions/api.service";
import { AppIdService } from "../../abstractions/appId.service";
import { CryptoService } from "../../abstractions/crypto.service";
import { EnvironmentService } from "../../abstractions/environment.service";
import { LogService } from "../../abstractions/log.service";
import { MessagingService } from "../../abstractions/messaging.service";
import { PlatformUtilsService } from "../../abstractions/platformUtils.service";
import { StateService } from "../../abstractions/state.service";
import { TokenService } from "../../auth/abstractions/token.service";
import { TwoFactorService } from "../../auth/abstractions/two-factor.service";
import { KeyConnectorService } from "../abstractions/key-connector.service";
import { UserApiLogInCredentials } from "../models/domain/log-in-credentials";
import { UserApiTokenRequest } from "../models/request/identity-token/user-api-token.request";
import { IdentityTokenResponse } from "../models/response/identity-token.response";

import { LogInStrategy } from "./login.strategy";

export class UserApiLogInStrategy extends LogInStrategy {
  tokenRequest: UserApiTokenRequest;

  constructor(
    cryptoService: CryptoService,
    apiService: ApiService,
    tokenService: TokenService,
    appIdService: AppIdService,
    platformUtilsService: PlatformUtilsService,
    messagingService: MessagingService,
    logService: LogService,
    stateService: StateService,
    twoFactorService: TwoFactorService,
    private environmentService: EnvironmentService,
    private keyConnectorService: KeyConnectorService
  ) {
    super(
      cryptoService,
      apiService,
      tokenService,
      appIdService,
      platformUtilsService,
      messagingService,
      logService,
      stateService,
      twoFactorService
    );
  }

  async setUserKey(tokenResponse: IdentityTokenResponse) {
    if (tokenResponse.apiUseKeyConnector) {
      const keyConnectorUrl = this.environmentService.getKeyConnectorUrl();
      await this.keyConnectorService.getAndSetKey(keyConnectorUrl);
    }
  }

  async logIn(credentials: UserApiLogInCredentials) {
    this.tokenRequest = new UserApiTokenRequest(
      credentials.clientId,
      credentials.clientSecret,
      await this.buildTwoFactor(),
      await this.buildDeviceRequest()
    );

    const [authResult] = await this.startLogIn();
    return authResult;
  }

  protected async saveAccountInformation(tokenResponse: IdentityTokenResponse) {
    await super.saveAccountInformation(tokenResponse);
    await this.stateService.setApiKeyClientId(this.tokenRequest.clientId);
    await this.stateService.setApiKeyClientSecret(this.tokenRequest.clientSecret);
  }
}
