import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { LoginWithDeviceComponent as BaseLoginWithDeviceComponent } from "@bitwarden/angular/auth/components/login-with-device.component";
import { AnonymousHubService } from "@bitwarden/common/abstractions/anonymousHub.service";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { AppIdService } from "@bitwarden/common/abstractions/appId.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { CryptoFunctionService } from "@bitwarden/common/abstractions/cryptoFunction.service";
import { EnvironmentService } from "@bitwarden/common/abstractions/environment.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { ValidationService } from "@bitwarden/common/abstractions/validation.service";
import { AuthService } from "@bitwarden/common/auth/abstractions/auth.service";
import { LoginService } from "@bitwarden/common/auth/abstractions/login.service";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";

import { StateService } from "../../core";

@Component({
  selector: "app-login-with-device",
  templateUrl: "login-with-device.component.html",
})
export class LoginWithDeviceComponent
  extends BaseLoginWithDeviceComponent
  implements OnInit, OnDestroy
{
  constructor(
    router: Router,
    cryptoService: CryptoService,
    cryptoFunctionService: CryptoFunctionService,
    appIdService: AppIdService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    apiService: ApiService,
    authService: AuthService,
    logService: LogService,
    environmentService: EnvironmentService,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    anonymousHubService: AnonymousHubService,
    validationService: ValidationService,
    stateService: StateService,
    loginService: LoginService
  ) {
    super(
      router,
      cryptoService,
      cryptoFunctionService,
      appIdService,
      passwordGenerationService,
      apiService,
      authService,
      logService,
      environmentService,
      i18nService,
      platformUtilsService,
      anonymousHubService,
      validationService,
      stateService,
      loginService
    );
  }
}
