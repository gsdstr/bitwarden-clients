import { Component } from "@angular/core";

import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { UserVerificationService } from "@bitwarden/common/abstractions/userVerification/userVerification.service.abstraction";
import { TwoFactorProviderType } from "@bitwarden/common/auth/enums/two-factor-provider-type";
import { UpdateTwoFactorDuoRequest } from "@bitwarden/common/auth/models/request/update-two-factor-duo.request";
import { TwoFactorDuoResponse } from "@bitwarden/common/auth/models/response/two-factor-duo.response";
import { AuthResponse } from "@bitwarden/common/auth/types/auth-response";

import { TwoFactorBaseComponent } from "./two-factor-base.component";

@Component({
  selector: "app-two-factor-duo",
  templateUrl: "two-factor-duo.component.html",
})
export class TwoFactorDuoComponent extends TwoFactorBaseComponent {
  type = TwoFactorProviderType.Duo;
  ikey: string;
  skey: string;
  host: string;
  formPromise: Promise<TwoFactorDuoResponse>;

  override componentName = "app-two-factor-duo";

  constructor(
    apiService: ApiService,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    logService: LogService,
    userVerificationService: UserVerificationService,
    dialogService: DialogServiceAbstraction
  ) {
    super(
      apiService,
      i18nService,
      platformUtilsService,
      logService,
      userVerificationService,
      dialogService
    );
  }

  auth(authResponse: AuthResponse<TwoFactorDuoResponse>) {
    super.auth(authResponse);
    this.processResponse(authResponse.response);
  }

  submit() {
    if (this.enabled) {
      return super.disable(this.formPromise);
    } else {
      return this.enable();
    }
  }

  protected async enable() {
    const request = await this.buildRequestModel(UpdateTwoFactorDuoRequest);
    request.integrationKey = this.ikey;
    request.secretKey = this.skey;
    request.host = this.host;

    return super.enable(async () => {
      if (this.organizationId != null) {
        this.formPromise = this.apiService.putTwoFactorOrganizationDuo(
          this.organizationId,
          request
        );
      } else {
        this.formPromise = this.apiService.putTwoFactorDuo(request);
      }
      const response = await this.formPromise;
      await this.processResponse(response);
    });
  }

  private processResponse(response: TwoFactorDuoResponse) {
    this.ikey = response.integrationKey;
    this.skey = response.secretKey;
    this.host = response.host;
    this.enabled = response.enabled;
  }
}
