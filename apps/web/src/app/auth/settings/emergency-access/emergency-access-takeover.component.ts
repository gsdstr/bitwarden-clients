import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { takeUntil } from "rxjs";

import { ChangePasswordComponent } from "@bitwarden/angular/auth/components/change-password.component";
import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { PolicyData } from "@bitwarden/common/admin-console/models/data/policy.data";
import { Policy } from "@bitwarden/common/admin-console/models/domain/policy";
import { PolicyResponse } from "@bitwarden/common/admin-console/models/response/policy.response";
import { KdfConfig } from "@bitwarden/common/auth/models/domain/kdf-config";
import { EmergencyAccessPasswordRequest } from "@bitwarden/common/auth/models/request/emergency-access-password.request";
import { KdfType } from "@bitwarden/common/enums";
import { SymmetricCryptoKey } from "@bitwarden/common/models/domain/symmetric-crypto-key";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";

@Component({
  selector: "emergency-access-takeover",
  templateUrl: "emergency-access-takeover.component.html",
})
// eslint-disable-next-line rxjs-angular/prefer-takeuntil
export class EmergencyAccessTakeoverComponent
  extends ChangePasswordComponent
  implements OnInit, OnDestroy
{
  @Output() onDone = new EventEmitter();
  @Input() emergencyAccessId: string;
  @Input() name: string;
  @Input() email: string;
  @Input() kdf: KdfType;
  @Input() kdfIterations: number;

  formPromise: Promise<any>;

  constructor(
    i18nService: I18nService,
    cryptoService: CryptoService,
    messagingService: MessagingService,
    stateService: StateService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    platformUtilsService: PlatformUtilsService,
    policyService: PolicyService,
    private apiService: ApiService,
    private logService: LogService,
    dialogService: DialogServiceAbstraction
  ) {
    super(
      i18nService,
      cryptoService,
      messagingService,
      passwordGenerationService,
      platformUtilsService,
      policyService,
      stateService,
      dialogService
    );
  }

  async ngOnInit() {
    const response = await this.apiService.getEmergencyGrantorPolicies(this.emergencyAccessId);
    if (response.data != null && response.data.length > 0) {
      const policies = response.data.map(
        (policyResponse: PolicyResponse) => new Policy(new PolicyData(policyResponse))
      );

      this.policyService
        .masterPasswordPolicyOptions$(policies)
        .pipe(takeUntil(this.destroy$))
        .subscribe((enforcedPolicyOptions) => (this.enforcedPolicyOptions = enforcedPolicyOptions));
    }
  }

  // eslint-disable-next-line rxjs-angular/prefer-takeuntil
  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  async submit() {
    if (!(await this.strongPassword())) {
      return;
    }

    const takeoverResponse = await this.apiService.postEmergencyAccessTakeover(
      this.emergencyAccessId
    );

    const oldKeyBuffer = await this.cryptoService.rsaDecrypt(takeoverResponse.keyEncrypted);
    const oldEncKey = new SymmetricCryptoKey(oldKeyBuffer);

    if (oldEncKey == null) {
      this.platformUtilsService.showToast(
        "error",
        this.i18nService.t("errorOccurred"),
        this.i18nService.t("unexpectedError")
      );
      return;
    }

    const key = await this.cryptoService.makeKey(
      this.masterPassword,
      this.email,
      takeoverResponse.kdf,
      new KdfConfig(
        takeoverResponse.kdfIterations,
        takeoverResponse.kdfMemory,
        takeoverResponse.kdfParallelism
      )
    );
    const masterPasswordHash = await this.cryptoService.hashPassword(this.masterPassword, key);

    const encKey = await this.cryptoService.remakeEncKey(key, oldEncKey);

    const request = new EmergencyAccessPasswordRequest();
    request.newMasterPasswordHash = masterPasswordHash;
    request.key = encKey[1].encryptedString;

    this.apiService.postEmergencyAccessPassword(this.emergencyAccessId, request);

    try {
      this.onDone.emit();
    } catch (e) {
      this.logService.error(e);
    }
  }
}
