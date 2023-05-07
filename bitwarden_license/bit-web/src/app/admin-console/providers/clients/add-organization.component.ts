import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { DialogServiceAbstraction, SimpleDialogType } from "@bitwarden/angular/services/dialog";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { PlatformUtilsService } from "@bitwarden/common/abstractions/platformUtils.service";
import { ValidationService } from "@bitwarden/common/abstractions/validation.service";
import { ProviderService } from "@bitwarden/common/admin-console/abstractions/provider.service";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { Provider } from "@bitwarden/common/models/domain/provider";

import { WebProviderService } from "../services/web-provider.service";

@Component({
  selector: "provider-add-organization",
  templateUrl: "add-organization.component.html",
})
export class AddOrganizationComponent implements OnInit {
  @Input() providerId: string;
  @Input() organizations: Organization[];
  @Output() onAddedOrganization = new EventEmitter();

  provider: Provider;
  formPromise: Promise<any>;
  loading = true;

  constructor(
    private providerService: ProviderService,
    private webProviderService: WebProviderService,
    private i18nService: I18nService,
    private platformUtilsService: PlatformUtilsService,
    private validationService: ValidationService,
    private dialogService: DialogServiceAbstraction
  ) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    if (this.providerId == null) {
      return;
    }

    this.provider = await this.providerService.get(this.providerId);

    this.loading = false;
  }

  async add(organization: Organization) {
    if (this.formPromise) {
      return;
    }

    const confirmed = await this.dialogService.openSimpleDialog({
      title: organization.name,
      content: {
        key: "addOrganizationConfirmation",
        placeholders: [organization.name, this.provider.name],
      },
      type: SimpleDialogType.WARNING,
    });

    if (!confirmed) {
      return false;
    }

    try {
      this.formPromise = this.webProviderService.addOrganizationToProvider(
        this.providerId,
        organization.id
      );
      await this.formPromise;
    } catch (e) {
      this.validationService.showError(e);
      return;
    } finally {
      this.formPromise = null;
    }

    this.platformUtilsService.showToast(
      "success",
      null,
      this.i18nService.t("organizationJoinedProvider")
    );
    this.onAddedOrganization.emit();
  }
}
