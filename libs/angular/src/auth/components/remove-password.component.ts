import { Directive, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { StateService } from "@bitwarden/common/abstractions/state.service";
import { OrganizationApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/organization/organization-api.service.abstraction";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { KeyConnectorService } from "@bitwarden/common/auth/abstractions/key-connector.service";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";

import { DialogServiceAbstraction, SimpleDialogType } from "../../services/dialog";

@Directive()
export class RemovePasswordComponent implements OnInit {
  actionPromise: Promise<void | boolean>;
  continuing = false;
  leaving = false;

  loading = true;
  organization: Organization;
  email: string;

  constructor(
    private router: Router,
    private stateService: StateService,
    private syncService: SyncService,
    private platformUtilsService: PlatformUtilsService,
    private i18nService: I18nService,
    private keyConnectorService: KeyConnectorService,
    private organizationApiService: OrganizationApiServiceAbstraction,
    private dialogService: DialogServiceAbstraction
  ) {}

  async ngOnInit() {
    this.organization = await this.keyConnectorService.getManagingOrganization();
    this.email = await this.stateService.getEmail();
    await this.syncService.fullSync(false);
    this.loading = false;
  }

  async convert() {
    this.continuing = true;
    this.actionPromise = this.keyConnectorService.migrateUser();

    try {
      await this.actionPromise;
      this.platformUtilsService.showToast(
        "success",
        null,
        this.i18nService.t("removedMasterPassword")
      );
      await this.keyConnectorService.removeConvertAccountRequired();
      this.router.navigate([""]);
    } catch (e) {
      this.platformUtilsService.showToast("error", this.i18nService.t("errorOccurred"), e.message);
    }
  }

  async leave() {
    const confirmed = await this.dialogService.openSimpleDialog({
      title: this.organization.name,
      content: { key: "leaveOrganizationConfirmation" },
      type: SimpleDialogType.WARNING,
    });

    if (!confirmed) {
      return false;
    }

    try {
      this.leaving = true;
      this.actionPromise = this.organizationApiService.leave(this.organization.id);
      await this.actionPromise;
      this.platformUtilsService.showToast("success", null, this.i18nService.t("leftOrganization"));
      await this.keyConnectorService.removeConvertAccountRequired();
      this.router.navigate([""]);
    } catch (e) {
      this.platformUtilsService.showToast("error", this.i18nService.t("errorOccurred"), e);
    }
  }
}
