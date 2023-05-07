import { Component, NgZone } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ipcRenderer } from "electron";

import { LockComponent as BaseLockComponent } from "@bitwarden/angular/auth/components/lock.component";
import { DialogServiceAbstraction, SimpleDialogType } from "@bitwarden/angular/services/dialog";
import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { BroadcasterService } from "@bitwarden/common/abstractions/broadcaster.service";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { EnvironmentService } from "@bitwarden/common/abstractions/environment.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { MessagingService } from "@bitwarden/common/abstractions/messaging.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { VaultTimeoutService } from "@bitwarden/common/abstractions/vaultTimeout/vaultTimeout.service";
import { VaultTimeoutSettingsService } from "@bitwarden/common/abstractions/vaultTimeout/vaultTimeoutSettings.service";
import { PolicyApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/policy/policy-api.service.abstraction";
import { InternalPolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { KeyConnectorService } from "@bitwarden/common/auth/abstractions/key-connector.service";
import { DeviceType, KeySuffixOptions } from "@bitwarden/common/enums";
import { PasswordGenerationServiceAbstraction } from "@bitwarden/common/tools/generator/password";

import { ElectronStateService } from "../services/electron-state.service.abstraction";
import { BiometricStorageAction, BiometricMessage } from "../types/biometric-message";

const BroadcasterSubscriptionId = "LockComponent";

@Component({
  selector: "app-lock",
  templateUrl: "lock.component.html",
})
export class LockComponent extends BaseLockComponent {
  private deferFocus: boolean = null;
  protected biometricReady = false;

  constructor(
    router: Router,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    messagingService: MessagingService,
    cryptoService: CryptoService,
    vaultTimeoutService: VaultTimeoutService,
    vaultTimeoutSettingsService: VaultTimeoutSettingsService,
    environmentService: EnvironmentService,
    protected override stateService: ElectronStateService,
    apiService: ApiService,
    private route: ActivatedRoute,
    private broadcasterService: BroadcasterService,
    ngZone: NgZone,
    policyApiService: PolicyApiServiceAbstraction,
    policyService: InternalPolicyService,
    passwordGenerationService: PasswordGenerationServiceAbstraction,
    logService: LogService,
    keyConnectorService: KeyConnectorService,
    dialogService: DialogServiceAbstraction
  ) {
    super(
      router,
      i18nService,
      platformUtilsService,
      messagingService,
      cryptoService,
      vaultTimeoutService,
      vaultTimeoutSettingsService,
      environmentService,
      stateService,
      apiService,
      logService,
      keyConnectorService,
      ngZone,
      policyApiService,
      policyService,
      passwordGenerationService,
      dialogService
    );
  }

  async ngOnInit() {
    await super.ngOnInit();
    const autoPromptBiometric = !(await this.stateService.getDisableAutoBiometricsPrompt());
    this.biometricReady = await this.canUseBiometric();

    await this.displayBiometricUpdateWarning();

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.route.queryParams.subscribe((params) => {
      setTimeout(async () => {
        if (!params.promptBiometric || !this.supportsBiometric || !autoPromptBiometric) {
          return;
        }

        if (await ipcRenderer.invoke("windowVisible")) {
          this.unlockBiometric();
        }
      }, 1000);
    });
    this.broadcasterService.subscribe(BroadcasterSubscriptionId, async (message: any) => {
      this.ngZone.run(() => {
        switch (message.command) {
          case "windowHidden":
            this.onWindowHidden();
            break;
          case "windowIsFocused":
            if (this.deferFocus === null) {
              this.deferFocus = !message.windowIsFocused;
              if (!this.deferFocus) {
                this.focusInput();
              }
            } else if (this.deferFocus && message.windowIsFocused) {
              this.focusInput();
              this.deferFocus = false;
            }
            break;
          default:
        }
      });
    });
    this.messagingService.send("getWindowIsFocused");
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.broadcasterService.unsubscribe(BroadcasterSubscriptionId);
  }

  onWindowHidden() {
    this.showPassword = false;
  }

  private async canUseBiometric() {
    const userId = await this.stateService.getUserId();
    const val = await ipcRenderer.invoke("biometric", {
      action: BiometricStorageAction.EnabledForUser,
      key: `${userId}_masterkey_biometric`,
      keySuffix: KeySuffixOptions.Biometric,
      userId: userId,
    } as BiometricMessage);
    return val != null ? (JSON.parse(val) as boolean) : null;
  }

  private focusInput() {
    document.getElementById(this.pinLock ? "pin" : "masterPassword").focus();
  }

  private async displayBiometricUpdateWarning(): Promise<void> {
    if (await this.stateService.getDismissedBiometricRequirePasswordOnStart()) {
      return;
    }

    if (this.platformUtilsService.getDevice() !== DeviceType.WindowsDesktop) {
      return;
    }

    if (await this.stateService.getBiometricUnlock()) {
      const response = await this.dialogService.openSimpleDialog({
        title: { key: "windowsBiometricUpdateWarningTitle" },
        content: { key: "windowsBiometricUpdateWarning" },
        type: SimpleDialogType.WARNING,
      });

      await this.stateService.setBiometricRequirePasswordOnStart(response);
      if (response) {
        await this.stateService.setDisableAutoBiometricsPrompt(true);
      }
      this.supportsBiometric = await this.canUseBiometric();
      await this.stateService.setDismissedBiometricRequirePasswordOnStart();
    }
  }
}
