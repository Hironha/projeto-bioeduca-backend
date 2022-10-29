import { storage } from "@utils/database";

export class PlantBucket {
	constructor(private readonly storageName: string) {}

	async deleteImages(plantId: string, images?: string[]) {
		const bucket = storage.bucket();

		if (images === undefined) {
			await bucket.deleteFiles({ prefix: `${this.storageName}/${plantId}` });
		} else {
			const deleteFilePromises = images.map((image) => {
				const filePath = `${this.storageName}/${plantId}/${image}`;
				return bucket.file(filePath).delete();
			});

			await Promise.all(deleteFilePromises);
		}
	}

	async storeImages(plantId: string, images: Express.Multer.File[]): Promise<string[]> {
		return await Promise.all(images.map((file) => this.storeImage(plantId, file)));
	}

	async storeImage(plantId: string, image: Express.Multer.File): Promise<string> {
		const bucket = storage.bucket();
		const file = bucket.file(
			`${this.storageName}/${plantId}/${image.filename || image.originalname}`
		);

		await file.save(image.buffer, {
			public: true,
			metadata: {
				contentType: image.mimetype,
				cacheControl: "public, max-age=" + 60 * 60 * 24,
			},
		});

		return file.publicUrl();
	}

	listPlantImagesURLs(plantId: string, images: string[]) {
		const bucket = storage.bucket();
		const folderPublicURL = bucket.file(`${this.storageName}/${plantId}`).publicUrl();
		return images.map((imageName) => `${folderPublicURL}/${imageName}`);
	}
}
