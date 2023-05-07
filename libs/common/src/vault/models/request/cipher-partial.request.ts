import { CipherData } from "../data/cipher.data";
import { Cipher } from "../domain/cipher";

export class CipherPartialRequest {
  folderId: string;
  favorite: boolean;
  archivedDate: Date;

  private constructor(folderId: string, favorite: boolean, archivedDate: Date) {
    this.folderId = folderId;
    this.favorite = favorite;
    this.archivedDate = archivedDate;
  }

  static fromCipher(cipher: Cipher) {
    return new CipherPartialRequest(cipher.folderId, cipher.favorite, cipher.archivedDate);
  }

  static fromCipherData(cipher: CipherData) {
    const archivedDate = cipher.archivedDate != null ? new Date(cipher.archivedDate) : null;
    return new CipherPartialRequest(cipher.folderId, cipher.favorite, archivedDate);
  }
}
