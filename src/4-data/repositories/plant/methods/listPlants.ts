import { db } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { PlantPreviewModel } from "@data/models/plantPreview";
import { type IPlantPreviewModel, type IStoredPlantModel } from "@data/interfaces/models/plant";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

export class ListPlantsMethod {
	constructor(private readonly collectionName: string) {}

	private async getPlantSnapshot(plantId?: string) {
		if (!plantId) return undefined;
		return await db.collection(this.collectionName).doc(plantId).get();
	}

	private async getListSnapshot(
		query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
		lastPlantIdSent?: string
	) {
		const lastSnapshotSent = await this.getPlantSnapshot(lastPlantIdSent);

		if (lastSnapshotSent) return await query.startAfter(lastSnapshotSent).get();
		return await query.get();
	}

	async listPaginated(
		listEntity: IListPaginatedEntityInput
	): Promise<{ hasMore: boolean; plantModels: PlantModel[] }> {
		const listQuery = db
			.collection(this.collectionName)
			.limit(listEntity.perPage + 1)
			.orderBy("created_at", "desc");

		const listSnapshot = await this.getListSnapshot(listQuery, listEntity.lastKey);

		const queriedSnapshots = listSnapshot.docs.slice(0, listEntity.perPage);
		const plantModels: PlantModel[] = queriedSnapshots.map((plantDoc) => {
			const { images, ...plantData } = plantDoc.data() as IStoredPlantModel;
			return new PlantModel({ ...plantData, images, id: plantDoc.id });
		});

		return {
			hasMore: listSnapshot.size > plantModels.length,
			plantModels,
		};
	}

	async listPreviewPaginated(
		listEntity: IListPaginatedEntityInput
	): Promise<{ hasMore: boolean; plantsPreview: PlantPreviewModel[] }> {
		const listQuery = db
			.collection(this.collectionName)
			.limit(listEntity.perPage + 1)
			.select("scientific_name", "popular_name", "images")
			.orderBy("created_at", "desc");

		const listSnapshot = await this.getListSnapshot(listQuery, listEntity.lastKey);

		const queriedSnapshots = listSnapshot.docs.slice(0, listEntity.perPage);
		const plantsPreview: PlantPreviewModel[] = queriedSnapshots.map((plantDoc) => {
			const previewData = plantDoc.data() as IPlantPreviewModel;
			return new PlantPreviewModel({ ...previewData, id: plantDoc.id });
		});

		return {
			hasMore: listSnapshot.size > plantsPreview.length,
			plantsPreview,
		};
	}
}
