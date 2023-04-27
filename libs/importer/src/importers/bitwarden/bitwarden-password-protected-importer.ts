import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { KdfConfig } from "@bitwarden/common/auth/models/domain/kdf-config";
import { KdfType } from "@bitwarden/common/enums";
import { EncString } from "@bitwarden/common/models/domain/enc-string";
import { SymmetricCryptoKey } from "@bitwarden/common/models/domain/symmetric-crypto-key";
import { BitwardenPasswordProtectedFileFormat } from "@bitwarden/exporter/vault-export/bitwarden-password-protected-types";

import { ImportResult } from "../../models/import-result";
import { Importer } from "../importer";

import { BitwardenJsonImporter } from "./bitwarden-json-importer";
export class BitwardenPasswordProtectedImporter extends BitwardenJsonImporter implements Importer {
  private key: SymmetricCryptoKey;

  constructor(
    cryptoService: CryptoService,
    i18nService: I18nService,
    private promptForPassword_callback: () => Promise<string>
  ) {
    super(cryptoService, i18nService);
  }

  async parse(data: string): Promise<ImportResult> {
    const result = new ImportResult();
    const parsedData: BitwardenPasswordProtectedFileFormat = JSON.parse(data);

    if (!parsedData) {
      result.success = false;
      return result;
    }

    // File is unencrypted
    if (!parsedData?.encrypted) {
      return await super.parse(data);
    }

    // File is account-encrypted
    if (!parsedData?.passwordProtected) {
      return await super.parse(data);
    }

    if (this.cannotParseFile(parsedData)) {
      result.success = false;
      return result;
    }

    // File is password-protected
    const password = await this.promptForPassword_callback();
    if (!(await this.checkPassword(parsedData, password))) {
      result.success = false;
      result.errorMessage = this.i18nService.t("invalidFilePassword");
      return result;
    }

    const encData = new EncString(parsedData.data);
    const clearTextData = await this.cryptoService.decryptToUtf8(encData, this.key);
    return await super.parse(clearTextData);
  }

  private async checkPassword(
    jdoc: BitwardenPasswordProtectedFileFormat,
    password: string
  ): Promise<boolean> {
    this.key = await this.cryptoService.makePinKey(
      password,
      jdoc.salt,
      jdoc.kdfType,
      new KdfConfig(jdoc.kdfIterations, jdoc.kdfMemory, jdoc.kdfParallelism)
    );

    const encKeyValidation = new EncString(jdoc.encKeyValidation_DO_NOT_EDIT);

    const encKeyValidationDecrypt = await this.cryptoService.decryptToUtf8(
      encKeyValidation,
      this.key
    );
    if (encKeyValidationDecrypt === null) {
      return false;
    }
    return true;
  }

  private cannotParseFile(jdoc: BitwardenPasswordProtectedFileFormat): boolean {
    return (
      !jdoc ||
      !jdoc.encrypted ||
      !jdoc.passwordProtected ||
      !jdoc.salt ||
      !jdoc.kdfIterations ||
      typeof jdoc.kdfIterations !== "number" ||
      jdoc.kdfType == null ||
      KdfType[jdoc.kdfType] == null ||
      !jdoc.encKeyValidation_DO_NOT_EDIT ||
      !jdoc.data
    );
  }
}
