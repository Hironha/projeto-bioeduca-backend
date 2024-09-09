import { storage } from "@core/firebase";
import { PlantException } from "./exception";

export type Image = {
  filename: string;
  mimetype: string;
  buffer: Buffer;
};

export class FirebasePlantImageStorage {
  private readonly storage = "plants";

  /**
   * @returns {string} - Returns a public URL to stored image.
   * @throws {PlantException}
   */
  async store(plantId: string, image: Image): Promise<string> {
    const bucket = storage.bucket();
    const file = bucket.file(this.getImagePath(plantId, image.filename));

    try {
      await file.save(image.buffer, {
        public: true,
        metadata: {
          contentType: image.mimetype,
          cacheControl: "public, max-age=" + 60 * 60 * 24,
        },
      });

      return file.publicUrl();
    } catch (e) {
      console.error("Unexpected store image error at plant image storage: ", e);
      await file.delete().catch((e) => {
        console.error("Failed store plant image rollback at plant image storage: ", e);
      });
      throw PlantException.storage();
    }
  }

  /**
   * @throws {PlantException}
   */
  async remove(plantId: string, filename: string): Promise<void> {
    try {
      const bucket = storage.bucket();
      await bucket.file(this.getImagePath(plantId, filename)).delete();
    } catch (e) {
      console.error("Unexpected remove image error at plant image storage: ", e);
      throw PlantException.storage();
    }
  }

  private getImagePath(plantId: string, filename: string): string {
    return `${this.storage}/${plantId}/${filename}`;
  }
}
