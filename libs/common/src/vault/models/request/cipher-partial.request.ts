import { CipherData } from "../data/cipher.data";
import { Cipher } from "../domain/cipher";

export class CipherPartialRequest {
  folderId: string;
  favorite: boolean;
  archiveDate: Date;

  private constructor(folderId: string, favorite: boolean, archiveDate: Date) {
    this.folderId = folderId;
    this.favorite = favorite;
    this.archiveDate = archiveDate;
  }

  static fromCipher(cipher: Cipher) {
    return new CipherPartialRequest(cipher.folderId, cipher.favorite, cipher.archiveDate);
  }

  static fromCipherData(cipher: CipherData) {
    const archiveDate = cipher.archiveDate != null ? new Date(cipher.archiveDate) : null;
    return new CipherPartialRequest(cipher.folderId, cipher.favorite, archiveDate);
  }
}
