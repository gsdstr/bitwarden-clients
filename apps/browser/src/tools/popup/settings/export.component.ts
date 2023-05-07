import { Component } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import { DialogServiceAbstraction } from "@bitwarden/angular/services/dialog";
import { ExportComponent as BaseExportComponent } from "@bitwarden/angular/tools/export/components/export.component";
import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { EventCollectionService } from "@bitwarden/common/abstractions/event/event-collection.service";
import { FileDownloadService } from "@bitwarden/common/abstractions/fileDownload/fileDownload.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { UserVerificationService } from "@bitwarden/common/abstractions/userVerification/userVerification.service.abstraction";
import { PolicyService } from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { VaultExportServiceAbstraction } from "@bitwarden/exporter/vault-export";

@Component({
  selector: "app-export",
  templateUrl: "export.component.html",
})
export class ExportComponent extends BaseExportComponent {
  constructor(
    cryptoService: CryptoService,
    i18nService: I18nService,
    platformUtilsService: PlatformUtilsService,
    exportService: VaultExportServiceAbstraction,
    eventCollectionService: EventCollectionService,
    policyService: PolicyService,
    private router: Router,
    logService: LogService,
    userVerificationService: UserVerificationService,
    formBuilder: UntypedFormBuilder,
    fileDownloadService: FileDownloadService,
    dialogService: DialogServiceAbstraction
  ) {
    super(
      cryptoService,
      i18nService,
      platformUtilsService,
      exportService,
      eventCollectionService,
      policyService,
      window,
      logService,
      userVerificationService,
      formBuilder,
      fileDownloadService,
      dialogService
    );
  }

  protected saved() {
    super.saved();
    this.router.navigate(["/tabs/settings"]);
  }
}
