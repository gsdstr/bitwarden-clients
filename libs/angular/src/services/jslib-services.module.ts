import { LOCALE_ID, NgModule } from "@angular/core";

import { AvatarUpdateService as AccountUpdateServiceAbstraction } from "@bitwarden/common/abstractions/account/avatar-update.service";
import { AnonymousHubService as AnonymousHubServiceAbstraction } from "@bitwarden/common/abstractions/anonymousHub.service";
import { ApiService as ApiServiceAbstraction } from "@bitwarden/common/abstractions/api.service";
import { AppIdService as AppIdServiceAbstraction } from "@bitwarden/common/abstractions/appId.service";
import { AuditService as AuditServiceAbstraction } from "@bitwarden/common/abstractions/audit.service";
import { BroadcasterService as BroadcasterServiceAbstraction } from "@bitwarden/common/abstractions/broadcaster.service";
import { ConfigApiServiceAbstraction } from "@bitwarden/common/abstractions/config/config-api.service.abstraction";
import { ConfigServiceAbstraction } from "@bitwarden/common/abstractions/config/config.service.abstraction";
import { CryptoService as CryptoServiceAbstraction } from "@bitwarden/common/abstractions/crypto.service";
import { CryptoFunctionService as CryptoFunctionServiceAbstraction } from "@bitwarden/common/abstractions/cryptoFunction.service";
import { EncryptService } from "@bitwarden/common/abstractions/encrypt.service";
import { EnvironmentService as EnvironmentServiceAbstraction } from "@bitwarden/common/abstractions/environment.service";
import { EventCollectionService as EventCollectionServiceAbstraction } from "@bitwarden/common/abstractions/event/event-collection.service";
import { EventUploadService as EventUploadServiceAbstraction } from "@bitwarden/common/abstractions/event/event-upload.service";
import { FileUploadService as FileUploadServiceAbstraction } from "@bitwarden/common/abstractions/file-upload/file-upload.service";
import { FormValidationErrorsService as FormValidationErrorsServiceAbstraction } from "@bitwarden/common/abstractions/formValidationErrors.service";
import { I18nService as I18nServiceAbstraction } from "@bitwarden/common/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/abstractions/log.service";
import { MessagingService as MessagingServiceAbstraction } from "@bitwarden/common/abstractions/messaging.service";
import { NotificationsService as NotificationsServiceAbstraction } from "@bitwarden/common/abstractions/notifications.service";
import { OrgDomainApiServiceAbstraction } from "@bitwarden/common/abstractions/organization-domain/org-domain-api.service.abstraction";
import {
  OrgDomainInternalServiceAbstraction,
  OrgDomainServiceAbstraction,
} from "@bitwarden/common/abstractions/organization-domain/org-domain.service.abstraction";
import { OrganizationUserService } from "@bitwarden/common/abstractions/organization-user/organization-user.service";
import { PlatformUtilsService as PlatformUtilsServiceAbstraction } from "@bitwarden/common/abstractions/platformUtils.service";
import { SearchService as SearchServiceAbstraction } from "@bitwarden/common/abstractions/search.service";
import { SettingsService as SettingsServiceAbstraction } from "@bitwarden/common/abstractions/settings.service";
import { StateService as StateServiceAbstraction } from "@bitwarden/common/abstractions/state.service";
import { StateMigrationService as StateMigrationServiceAbstraction } from "@bitwarden/common/abstractions/stateMigration.service";
import { AbstractStorageService } from "@bitwarden/common/abstractions/storage.service";
import { TotpService as TotpServiceAbstraction } from "@bitwarden/common/abstractions/totp.service";
import { UserVerificationApiServiceAbstraction } from "@bitwarden/common/abstractions/userVerification/userVerification-api.service.abstraction";
import { UserVerificationService as UserVerificationServiceAbstraction } from "@bitwarden/common/abstractions/userVerification/userVerification.service.abstraction";
import { ValidationService as ValidationServiceAbstraction } from "@bitwarden/common/abstractions/validation.service";
import { VaultTimeoutService as VaultTimeoutServiceAbstraction } from "@bitwarden/common/abstractions/vaultTimeout/vaultTimeout.service";
import { VaultTimeoutSettingsService as VaultTimeoutSettingsServiceAbstraction } from "@bitwarden/common/abstractions/vaultTimeout/vaultTimeoutSettings.service";
import { CollectionService as CollectionServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/collection.service";
import { OrganizationApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/organization/organization-api.service.abstraction";
import {
  InternalOrganizationService,
  OrganizationService as OrganizationServiceAbstraction,
} from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { PolicyApiServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/policy/policy-api.service.abstraction";
import {
  InternalPolicyService,
  PolicyService as PolicyServiceAbstraction,
} from "@bitwarden/common/admin-console/abstractions/policy/policy.service.abstraction";
import { ProviderService as ProviderServiceAbstraction } from "@bitwarden/common/admin-console/abstractions/provider.service";
import { CollectionService } from "@bitwarden/common/admin-console/services/collection.service";
import { OrganizationApiService } from "@bitwarden/common/admin-console/services/organization/organization-api.service";
import { OrganizationService } from "@bitwarden/common/admin-console/services/organization/organization.service";
import { PolicyApiService } from "@bitwarden/common/admin-console/services/policy/policy-api.service";
import { PolicyService } from "@bitwarden/common/admin-console/services/policy/policy.service";
import { ProviderService } from "@bitwarden/common/admin-console/services/provider.service";
import { AccountApiService as AccountApiServiceAbstraction } from "@bitwarden/common/auth/abstractions/account-api.service";
import {
  AccountService as AccountServiceAbstraction,
  InternalAccountService,
} from "@bitwarden/common/auth/abstractions/account.service";
import { AuthService as AuthServiceAbstraction } from "@bitwarden/common/auth/abstractions/auth.service";
import { KeyConnectorService as KeyConnectorServiceAbstraction } from "@bitwarden/common/auth/abstractions/key-connector.service";
import { LoginService as LoginServiceAbstraction } from "@bitwarden/common/auth/abstractions/login.service";
import { TokenService as TokenServiceAbstraction } from "@bitwarden/common/auth/abstractions/token.service";
import { TwoFactorService as TwoFactorServiceAbstraction } from "@bitwarden/common/auth/abstractions/two-factor.service";
import { AccountApiServiceImplementation } from "@bitwarden/common/auth/services/account-api.service";
import { AccountServiceImplementation } from "@bitwarden/common/auth/services/account.service";
import { AuthService } from "@bitwarden/common/auth/services/auth.service";
import { KeyConnectorService } from "@bitwarden/common/auth/services/key-connector.service";
import { LoginService } from "@bitwarden/common/auth/services/login.service";
import { TokenService } from "@bitwarden/common/auth/services/token.service";
import { TwoFactorService } from "@bitwarden/common/auth/services/two-factor.service";
import { UserVerificationApiService } from "@bitwarden/common/auth/services/user-verification/user-verification-api.service";
import { UserVerificationService } from "@bitwarden/common/auth/services/user-verification/user-verification.service";
import { StateFactory } from "@bitwarden/common/factories/stateFactory";
import { flagEnabled } from "@bitwarden/common/misc/flags";
import { Account } from "@bitwarden/common/models/domain/account";
import { GlobalState } from "@bitwarden/common/models/domain/global-state";
import { AvatarUpdateService } from "@bitwarden/common/services/account/avatar-update.service";
import { AnonymousHubService } from "@bitwarden/common/services/anonymousHub.service";
import { ApiService } from "@bitwarden/common/services/api.service";
import { AppIdService } from "@bitwarden/common/services/appId.service";
import { AuditService } from "@bitwarden/common/services/audit.service";
import { ConfigApiService } from "@bitwarden/common/services/config/config-api.service";
import { ConfigService } from "@bitwarden/common/services/config/config.service";
import { ConsoleLogService } from "@bitwarden/common/services/consoleLog.service";
import { CryptoService } from "@bitwarden/common/services/crypto.service";
import { EncryptServiceImplementation } from "@bitwarden/common/services/cryptography/encrypt.service.implementation";
import { MultithreadEncryptServiceImplementation } from "@bitwarden/common/services/cryptography/multithread-encrypt.service.implementation";
import { EnvironmentService } from "@bitwarden/common/services/environment.service";
import { EventCollectionService } from "@bitwarden/common/services/event/event-collection.service";
import { EventUploadService } from "@bitwarden/common/services/event/event-upload.service";
import { FileUploadService } from "@bitwarden/common/services/file-upload/file-upload.service";
import { FormValidationErrorsService } from "@bitwarden/common/services/formValidationErrors.service";
import { NotificationsService } from "@bitwarden/common/services/notifications.service";
import { OrgDomainApiService } from "@bitwarden/common/services/organization-domain/org-domain-api.service";
import { OrgDomainService } from "@bitwarden/common/services/organization-domain/org-domain.service";
import { OrganizationUserServiceImplementation } from "@bitwarden/common/services/organization-user/organization-user.service.implementation";
import { SearchService } from "@bitwarden/common/services/search.service";
import { SettingsService } from "@bitwarden/common/services/settings.service";
import { StateService } from "@bitwarden/common/services/state.service";
import { StateMigrationService } from "@bitwarden/common/services/stateMigration.service";
import { TotpService } from "@bitwarden/common/services/totp.service";
import { ValidationService } from "@bitwarden/common/services/validation.service";
import { VaultTimeoutService } from "@bitwarden/common/services/vaultTimeout/vaultTimeout.service";
import { VaultTimeoutSettingsService } from "@bitwarden/common/services/vaultTimeout/vaultTimeoutSettings.service";
import { WebCryptoFunctionService } from "@bitwarden/common/services/webCryptoFunction.service";
import {
  PasswordGenerationService,
  PasswordGenerationServiceAbstraction,
} from "@bitwarden/common/tools/generator/password";
import {
  UsernameGenerationService,
  UsernameGenerationServiceAbstraction,
} from "@bitwarden/common/tools/generator/username";
import { SendApiService } from "@bitwarden/common/tools/send/services/send-api.service";
import { SendApiService as SendApiServiceAbstraction } from "@bitwarden/common/tools/send/services/send-api.service.abstraction";
import { SendService } from "@bitwarden/common/tools/send/services/send.service";
import { SendService as SendServiceAbstraction } from "@bitwarden/common/tools/send/services/send.service.abstraction";
import { CipherService as CipherServiceAbstraction } from "@bitwarden/common/vault/abstractions/cipher.service";
import { CipherFileUploadService as CipherFileUploadServiceAbstraction } from "@bitwarden/common/vault/abstractions/file-upload/cipher-file-upload.service";
import { FolderApiServiceAbstraction } from "@bitwarden/common/vault/abstractions/folder/folder-api.service.abstraction";
import {
  FolderService as FolderServiceAbstraction,
  InternalFolderService,
} from "@bitwarden/common/vault/abstractions/folder/folder.service.abstraction";
import { PasswordRepromptService as PasswordRepromptServiceAbstraction } from "@bitwarden/common/vault/abstractions/password-reprompt.service";
import { SyncNotifierService as SyncNotifierServiceAbstraction } from "@bitwarden/common/vault/abstractions/sync/sync-notifier.service.abstraction";
import { SyncService as SyncServiceAbstraction } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";
import { CipherService } from "@bitwarden/common/vault/services/cipher.service";
import { CipherFileUploadService } from "@bitwarden/common/vault/services/file-upload/cipher-file-upload.service";
import { FolderApiService } from "@bitwarden/common/vault/services/folder/folder-api.service";
import { FolderService } from "@bitwarden/common/vault/services/folder/folder.service";
import { SyncNotifierService } from "@bitwarden/common/vault/services/sync/sync-notifier.service";
import { SyncService } from "@bitwarden/common/vault/services/sync/sync.service";
import {
  VaultExportService,
  VaultExportServiceAbstraction,
} from "@bitwarden/exporter/vault-export";

import { AuthGuard } from "../auth/guards/auth.guard";
import { LockGuard } from "../auth/guards/lock.guard";
import { UnauthGuard } from "../auth/guards/unauth.guard";
import { PasswordRepromptService } from "../vault/services/password-reprompt.service";

import { BroadcasterService } from "./broadcaster.service";
import {
  LOCALES_DIRECTORY,
  LOCKED_CALLBACK,
  LOG_MAC_FAILURES,
  LOGOUT_CALLBACK,
  MEMORY_STORAGE,
  SECURE_STORAGE,
  STATE_FACTORY,
  STATE_SERVICE_USE_CACHE,
  SYSTEM_LANGUAGE,
  WINDOW,
} from "./injection-tokens";
import { ModalService } from "./modal.service";
import { ThemingService } from "./theming/theming.service";
import { AbstractThemingService } from "./theming/theming.service.abstraction";

@NgModule({
  declarations: [],
  providers: [
    AuthGuard,
    UnauthGuard,
    LockGuard,
    ModalService,
    { provide: WINDOW, useValue: window },
    {
      provide: LOCALE_ID,
      useFactory: (i18nService: I18nServiceAbstraction) => i18nService.translationLocale,
      deps: [I18nServiceAbstraction],
    },
    {
      provide: LOCALES_DIRECTORY,
      useValue: "./locales",
    },
    {
      provide: SYSTEM_LANGUAGE,
      useFactory: (window: Window) => window.navigator.language,
      deps: [WINDOW],
    },
    {
      provide: STATE_FACTORY,
      useValue: new StateFactory(GlobalState, Account),
    },
    {
      provide: STATE_SERVICE_USE_CACHE,
      useValue: true,
    },
    {
      provide: LOGOUT_CALLBACK,
      useFactory:
        (messagingService: MessagingServiceAbstraction) => (expired: boolean, userId?: string) =>
          messagingService.send("logout", { expired: expired, userId: userId }),
      deps: [MessagingServiceAbstraction],
    },
    {
      provide: LOCKED_CALLBACK,
      useValue: null,
    },
    {
      provide: LOG_MAC_FAILURES,
      useValue: true,
    },
    {
      provide: AppIdServiceAbstraction,
      useClass: AppIdService,
      deps: [AbstractStorageService],
    },
    {
      provide: AuditServiceAbstraction,
      useClass: AuditService,
      deps: [CryptoFunctionServiceAbstraction, ApiServiceAbstraction],
    },
    {
      provide: AuthServiceAbstraction,
      useClass: AuthService,
      deps: [
        CryptoServiceAbstraction,
        ApiServiceAbstraction,
        TokenServiceAbstraction,
        AppIdServiceAbstraction,
        PlatformUtilsServiceAbstraction,
        MessagingServiceAbstraction,
        LogService,
        KeyConnectorServiceAbstraction,
        EnvironmentServiceAbstraction,
        StateServiceAbstraction,
        TwoFactorServiceAbstraction,
        I18nServiceAbstraction,
        EncryptService,
        PasswordGenerationServiceAbstraction,
        PolicyServiceAbstraction,
      ],
    },
    {
      provide: FileUploadServiceAbstraction,
      useClass: FileUploadService,
      deps: [LoginServiceAbstraction],
    },
    {
      provide: CipherFileUploadServiceAbstraction,
      useClass: CipherFileUploadService,
      deps: [ApiServiceAbstraction, FileUploadServiceAbstraction],
    },
    {
      provide: CipherServiceAbstraction,
      useFactory: (
        cryptoService: CryptoServiceAbstraction,
        settingsService: SettingsServiceAbstraction,
        apiService: ApiServiceAbstraction,
        i18nService: I18nServiceAbstraction,
        searchService: SearchServiceAbstraction,
        stateService: StateServiceAbstraction,
        encryptService: EncryptService,
        fileUploadService: CipherFileUploadServiceAbstraction
      ) =>
        new CipherService(
          cryptoService,
          settingsService,
          apiService,
          i18nService,
          searchService,
          stateService,
          encryptService,
          fileUploadService
        ),
      deps: [
        CryptoServiceAbstraction,
        SettingsServiceAbstraction,
        ApiServiceAbstraction,
        I18nServiceAbstraction,
        SearchServiceAbstraction,
        StateServiceAbstraction,
        EncryptService,
        CipherFileUploadServiceAbstraction,
      ],
    },
    {
      provide: FolderServiceAbstraction,
      useClass: FolderService,
      deps: [
        CryptoServiceAbstraction,
        I18nServiceAbstraction,
        CipherServiceAbstraction,
        StateServiceAbstraction,
      ],
    },
    {
      provide: InternalFolderService,
      useExisting: FolderServiceAbstraction,
    },
    {
      provide: FolderApiServiceAbstraction,
      useClass: FolderApiService,
      deps: [FolderServiceAbstraction, ApiServiceAbstraction],
    },
    {
      provide: AccountApiServiceAbstraction,
      useClass: AccountApiServiceImplementation,
      deps: [
        ApiServiceAbstraction,
        UserVerificationServiceAbstraction,
        LogService,
        InternalAccountService,
      ],
    },
    {
      provide: AccountServiceAbstraction,
      useClass: AccountServiceImplementation,
      deps: [MessagingServiceAbstraction, LogService],
    },
    {
      provide: InternalAccountService,
      useExisting: AccountServiceAbstraction,
    },
    {
      provide: AccountUpdateServiceAbstraction,
      useClass: AvatarUpdateService,
      deps: [ApiServiceAbstraction, StateServiceAbstraction],
    },
    { provide: LogService, useFactory: () => new ConsoleLogService(false) },
    {
      provide: CollectionServiceAbstraction,
      useClass: CollectionService,
      deps: [CryptoServiceAbstraction, I18nServiceAbstraction, StateServiceAbstraction],
    },
    {
      provide: EnvironmentServiceAbstraction,
      useClass: EnvironmentService,
      deps: [StateServiceAbstraction],
    },
    {
      provide: TotpServiceAbstraction,
      useClass: TotpService,
      deps: [CryptoFunctionServiceAbstraction, LogService, StateServiceAbstraction],
    },
    { provide: TokenServiceAbstraction, useClass: TokenService, deps: [StateServiceAbstraction] },
    {
      provide: CryptoServiceAbstraction,
      useClass: CryptoService,
      deps: [
        CryptoFunctionServiceAbstraction,
        EncryptService,
        PlatformUtilsServiceAbstraction,
        LogService,
        StateServiceAbstraction,
      ],
    },
    {
      provide: PasswordGenerationServiceAbstraction,
      useClass: PasswordGenerationService,
      deps: [CryptoServiceAbstraction, PolicyServiceAbstraction, StateServiceAbstraction],
    },
    {
      provide: UsernameGenerationServiceAbstraction,
      useClass: UsernameGenerationService,
      deps: [CryptoServiceAbstraction, StateServiceAbstraction, ApiServiceAbstraction],
    },
    {
      provide: ApiServiceAbstraction,
      useClass: ApiService,
      deps: [
        TokenServiceAbstraction,
        PlatformUtilsServiceAbstraction,
        EnvironmentServiceAbstraction,
        AppIdServiceAbstraction,
        LOGOUT_CALLBACK,
      ],
    },
    {
      provide: SendServiceAbstraction,
      useClass: SendService,
      deps: [
        CryptoServiceAbstraction,
        I18nServiceAbstraction,
        CryptoFunctionServiceAbstraction,
        StateServiceAbstraction,
      ],
    },
    {
      provide: SendApiServiceAbstraction,
      useClass: SendApiService,
      deps: [ApiServiceAbstraction, FileUploadServiceAbstraction, SendServiceAbstraction],
    },
    {
      provide: SyncServiceAbstraction,
      useClass: SyncService,
      deps: [
        ApiServiceAbstraction,
        SettingsServiceAbstraction,
        FolderServiceAbstraction,
        CipherServiceAbstraction,
        CryptoServiceAbstraction,
        CollectionServiceAbstraction,
        MessagingServiceAbstraction,
        PolicyServiceAbstraction,
        SendServiceAbstraction,
        LogService,
        KeyConnectorServiceAbstraction,
        StateServiceAbstraction,
        ProviderServiceAbstraction,
        FolderApiServiceAbstraction,
        OrganizationServiceAbstraction,
        SendApiServiceAbstraction,
        LOGOUT_CALLBACK,
      ],
    },
    { provide: BroadcasterServiceAbstraction, useClass: BroadcasterService },
    {
      provide: SettingsServiceAbstraction,
      useClass: SettingsService,
      deps: [StateServiceAbstraction],
    },
    {
      provide: VaultTimeoutSettingsServiceAbstraction,
      useClass: VaultTimeoutSettingsService,
      deps: [
        CryptoServiceAbstraction,
        TokenServiceAbstraction,
        PolicyServiceAbstraction,
        StateServiceAbstraction,
      ],
    },
    {
      provide: VaultTimeoutServiceAbstraction,
      useClass: VaultTimeoutService,
      deps: [
        CipherServiceAbstraction,
        FolderServiceAbstraction,
        CollectionServiceAbstraction,
        CryptoServiceAbstraction,
        PlatformUtilsServiceAbstraction,
        MessagingServiceAbstraction,
        SearchServiceAbstraction,
        KeyConnectorServiceAbstraction,
        StateServiceAbstraction,
        AuthServiceAbstraction,
        VaultTimeoutSettingsServiceAbstraction,
        LOCKED_CALLBACK,
        LOGOUT_CALLBACK,
      ],
    },
    {
      provide: StateServiceAbstraction,
      useClass: StateService,
      deps: [
        AbstractStorageService,
        SECURE_STORAGE,
        MEMORY_STORAGE,
        LogService,
        StateMigrationServiceAbstraction,
        STATE_FACTORY,
        STATE_SERVICE_USE_CACHE,
      ],
    },
    {
      provide: StateMigrationServiceAbstraction,
      useClass: StateMigrationService,
      deps: [AbstractStorageService, SECURE_STORAGE, STATE_FACTORY],
    },
    {
      provide: VaultExportServiceAbstraction,
      useClass: VaultExportService,
      deps: [
        FolderServiceAbstraction,
        CipherServiceAbstraction,
        ApiServiceAbstraction,
        CryptoServiceAbstraction,
        CryptoFunctionServiceAbstraction,
        StateServiceAbstraction,
      ],
    },
    {
      provide: SearchServiceAbstraction,
      useClass: SearchService,
      deps: [LogService, I18nServiceAbstraction],
    },
    {
      provide: NotificationsServiceAbstraction,
      useClass: NotificationsService,
      deps: [
        SyncServiceAbstraction,
        AppIdServiceAbstraction,
        ApiServiceAbstraction,
        EnvironmentServiceAbstraction,
        LOGOUT_CALLBACK,
        LogService,
        StateServiceAbstraction,
        AuthServiceAbstraction,
        MessagingServiceAbstraction,
      ],
    },
    {
      provide: CryptoFunctionServiceAbstraction,
      useClass: WebCryptoFunctionService,
      deps: [WINDOW],
    },
    {
      provide: EncryptService,
      useFactory: encryptServiceFactory,
      deps: [CryptoFunctionServiceAbstraction, LogService, LOG_MAC_FAILURES],
    },
    {
      provide: EventUploadServiceAbstraction,
      useClass: EventUploadService,
      deps: [ApiServiceAbstraction, StateServiceAbstraction, LogService],
    },
    {
      provide: EventCollectionServiceAbstraction,
      useClass: EventCollectionService,
      deps: [
        CipherServiceAbstraction,
        StateServiceAbstraction,
        OrganizationServiceAbstraction,
        EventUploadServiceAbstraction,
      ],
    },
    {
      provide: PolicyServiceAbstraction,
      useClass: PolicyService,
      deps: [StateServiceAbstraction, OrganizationServiceAbstraction],
    },
    {
      provide: InternalPolicyService,
      useExisting: PolicyServiceAbstraction,
    },
    {
      provide: PolicyApiServiceAbstraction,
      useClass: PolicyApiService,
      deps: [PolicyServiceAbstraction, ApiServiceAbstraction, StateServiceAbstraction],
    },
    {
      provide: KeyConnectorServiceAbstraction,
      useClass: KeyConnectorService,
      deps: [
        StateServiceAbstraction,
        CryptoServiceAbstraction,
        ApiServiceAbstraction,
        TokenServiceAbstraction,
        LogService,
        OrganizationServiceAbstraction,
        CryptoFunctionServiceAbstraction,
        SyncNotifierServiceAbstraction,
        MessagingServiceAbstraction,
        LOGOUT_CALLBACK,
      ],
    },
    {
      provide: UserVerificationServiceAbstraction,
      useClass: UserVerificationService,
      deps: [
        CryptoServiceAbstraction,
        I18nServiceAbstraction,
        UserVerificationApiServiceAbstraction,
      ],
    },
    { provide: PasswordRepromptServiceAbstraction, useClass: PasswordRepromptService },
    {
      provide: OrganizationServiceAbstraction,
      useClass: OrganizationService,
      deps: [StateServiceAbstraction],
    },
    {
      provide: InternalOrganizationService,
      useExisting: OrganizationServiceAbstraction,
    },
    {
      provide: OrganizationUserService,
      useClass: OrganizationUserServiceImplementation,
      deps: [ApiServiceAbstraction],
    },
    {
      provide: ProviderServiceAbstraction,
      useClass: ProviderService,
      deps: [StateServiceAbstraction],
    },
    {
      provide: TwoFactorServiceAbstraction,
      useClass: TwoFactorService,
      deps: [I18nServiceAbstraction, PlatformUtilsServiceAbstraction],
    },
    {
      provide: AbstractThemingService,
      useClass: ThemingService,
    },
    {
      provide: FormValidationErrorsServiceAbstraction,
      useClass: FormValidationErrorsService,
    },
    {
      provide: UserVerificationApiServiceAbstraction,
      useClass: UserVerificationApiService,
      deps: [ApiServiceAbstraction],
    },
    {
      provide: OrganizationApiServiceAbstraction,
      useClass: OrganizationApiService,
      // This is a slightly odd dependency tree for a specialized api service
      // it depends on SyncService so that new data can be retrieved through the sync
      // rather than updating the OrganizationService directly. Instead OrganizationService
      // subscribes to sync notifications and will update itself based on that.
      deps: [ApiServiceAbstraction, SyncServiceAbstraction],
    },
    {
      provide: SyncNotifierServiceAbstraction,
      useClass: SyncNotifierService,
    },
    {
      provide: ConfigServiceAbstraction,
      useClass: ConfigService,
      deps: [StateServiceAbstraction, ConfigApiServiceAbstraction, AuthServiceAbstraction],
    },
    {
      provide: ConfigApiServiceAbstraction,
      useClass: ConfigApiService,
      deps: [ApiServiceAbstraction],
    },
    {
      provide: AnonymousHubServiceAbstraction,
      useClass: AnonymousHubService,
      deps: [EnvironmentServiceAbstraction, AuthServiceAbstraction, LogService],
    },
    {
      provide: ValidationServiceAbstraction,
      useClass: ValidationService,
      deps: [I18nServiceAbstraction, PlatformUtilsServiceAbstraction],
    },
    {
      provide: LoginServiceAbstraction,
      useClass: LoginService,
      deps: [StateServiceAbstraction],
    },
    {
      provide: OrgDomainServiceAbstraction,
      useClass: OrgDomainService,
      deps: [PlatformUtilsServiceAbstraction, I18nServiceAbstraction],
    },
    {
      provide: OrgDomainInternalServiceAbstraction,
      useExisting: OrgDomainServiceAbstraction,
    },
    {
      provide: OrgDomainApiServiceAbstraction,
      useClass: OrgDomainApiService,
      deps: [OrgDomainServiceAbstraction, ApiServiceAbstraction],
    },
  ],
})
export class JslibServicesModule {}

function encryptServiceFactory(
  cryptoFunctionservice: CryptoFunctionServiceAbstraction,
  logService: LogService,
  logMacFailures: boolean
): EncryptService {
  return flagEnabled("multithreadDecryption")
    ? new MultithreadEncryptServiceImplementation(cryptoFunctionservice, logService, logMacFailures)
    : new EncryptServiceImplementation(cryptoFunctionservice, logService, logMacFailures);
}
