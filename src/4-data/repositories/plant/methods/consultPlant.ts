import { db } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { type IStoredPlantModel } from "@data/interfaces/models/plant";

import { type PlantBucket } from "../bucket/plantBucket";

export class ConsultPlantMethod {
	constructor(private readonly collectionName: string) {}

	async consultById(id: string, plantBucket: PlantBucket) {
		const doc = await db.collection(this.collectionName).doc(id).get();
		if (!doc.exists) return undefined;

		const { images, ...plantData } = doc.data() as IStoredPlantModel;
		const imageURLs = plantBucket.listPlantImagesURLs(doc.id, images || []);
		return new PlantModel({ ...plantData, images: imageURLs, id: doc.id });
	}
}
