import { CryptoService } from "@bitwarden/common/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/abstractions/i18n.service";
import { EncString } from "@bitwarden/common/models/domain/enc-string";
import {
  CipherWithIdExport,
  CollectionWithIdExport,
  FolderWithIdExport,
} from "@bitwarden/common/models/export";

import { ImportResult } from "../../models/import-result";
import { BaseImporter } from "../base-importer";
import { Importer } from "../importer";

export class BitwardenJsonImporter extends BaseImporter implements Importer {
  private results: any;
  private result: ImportResult;

  protected constructor(
    protected cryptoService: CryptoService,
    protected i18nService: I18nService
  ) {
    super();
  }

  async parse(data: string): Promise<ImportResult> {
    this.result = new ImportResult();
    this.results = JSON.parse(data);
    if (this.results == null || this.results.items == null) {
      this.result.success = false;
      return this.result;
    }

    if (this.results.encrypted) {
      await this.parseEncrypted();
    } else {
      this.parseDecrypted();
    }

    return this.result;
  }

  private async parseEncrypted() {
    if (this.results.encKeyValidation_DO_NOT_EDIT != null) {
      const orgKey = await this.cryptoService.getOrgKey(this.organizationId);
      const encKeyValidation = new EncString(this.results.encKeyValidation_DO_NOT_EDIT);
      const encKeyValidationDecrypt = await this.cryptoService.decryptToUtf8(
        encKeyValidation,
        orgKey
      );
      if (encKeyValidationDecrypt === null) {
        this.result.success = false;
        this.result.errorMessage = this.i18nService.t("importEncKeyError");
        return;
      }
    }

    const groupingsMap = new Map<string, number>();

    if (this.organization && this.results.collections != null) {
      for (const c of this.results.collections as CollectionWithIdExport[]) {
        const collection = CollectionWithIdExport.toDomain(c);
        if (collection != null) {
          collection.organizationId = this.organizationId;
          const view = await collection.decrypt();
          groupingsMap.set(c.id, this.result.collections.length);
          this.result.collections.push(view);
        }
      }
    } else if (!this.organization && this.results.folders != null) {
      for (const f of this.results.folders as FolderWithIdExport[]) {
        const folder = FolderWithIdExport.toDomain(f);
        if (folder != null) {
          const view = await folder.decrypt();
          groupingsMap.set(f.id, this.result.folders.length);
          this.result.folders.push(view);
        }
      }
    }

    for (const c of this.results.items as CipherWithIdExport[]) {
      const cipher = CipherWithIdExport.toDomain(c);
      // reset ids incase they were set for some reason
      cipher.id = null;
      cipher.organizationId = this.organizationId;
      cipher.collectionIds = null;

      // make sure password history is limited
      if (cipher.passwordHistory != null && cipher.passwordHistory.length > 5) {
        cipher.passwordHistory = cipher.passwordHistory.slice(0, 5);
      }

      if (!this.organization && c.folderId != null && groupingsMap.has(c.folderId)) {
        this.result.folderRelationships.push([
          this.result.ciphers.length,
          groupingsMap.get(c.folderId),
        ]);
      } else if (this.organization && c.collectionIds != null) {
        c.collectionIds.forEach((cId) => {
          if (groupingsMap.has(cId)) {
            this.result.collectionRelationships.push([
              this.result.ciphers.length,
              groupingsMap.get(cId),
            ]);
          }
        });
      }

      const view = await cipher.decrypt();
      this.cleanupCipher(view);
      this.result.ciphers.push(view);
    }

    this.result.success = true;
  }

  private parseDecrypted() {
    const groupingsMap = new Map<string, number>();
    if (this.organization && this.results.collections != null) {
      this.results.collections.forEach((c: CollectionWithIdExport) => {
        const collection = CollectionWithIdExport.toView(c);
        if (collection != null) {
          collection.organizationId = null;
          groupingsMap.set(c.id, this.result.collections.length);
          this.result.collections.push(collection);
        }
      });
    } else if (!this.organization && this.results.folders != null) {
      this.results.folders.forEach((f: FolderWithIdExport) => {
        const folder = FolderWithIdExport.toView(f);
        if (folder != null) {
          groupingsMap.set(f.id, this.result.folders.length);
          this.result.folders.push(folder);
        }
      });
    }

    this.results.items.forEach((c: CipherWithIdExport) => {
      const cipher = CipherWithIdExport.toView(c);
      // reset ids incase they were set for some reason
      cipher.id = null;
      cipher.organizationId = null;
      cipher.collectionIds = null;

      // make sure password history is limited
      if (cipher.passwordHistory != null && cipher.passwordHistory.length > 5) {
        cipher.passwordHistory = cipher.passwordHistory.slice(0, 5);
      }

      if (!this.organization && c.folderId != null && groupingsMap.has(c.folderId)) {
        this.result.folderRelationships.push([
          this.result.ciphers.length,
          groupingsMap.get(c.folderId),
        ]);
      } else if (this.organization && c.collectionIds != null) {
        c.collectionIds.forEach((cId) => {
          if (groupingsMap.has(cId)) {
            this.result.collectionRelationships.push([
              this.result.ciphers.length,
              groupingsMap.get(cId),
            ]);
          }
        });
      }

      this.cleanupCipher(cipher);
      this.result.ciphers.push(cipher);
    });

    this.result.success = true;
  }
}
