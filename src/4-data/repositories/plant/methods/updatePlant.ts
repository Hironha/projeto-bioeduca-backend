import { db } from "@utils/database";

import { firestore } from "firebase-admin";

export class UpdatePlantMethod {
	private readonly maxBatchOperations = 500;

	constructor(private readonly collectionName: string) {}

	private createBatchs(amount: number): firestore.WriteBatch[] {
		const batchs: firestore.WriteBatch[] = [];
		for (let i = 0; i < amount; i++) {
			batchs.push(db.batch());
		}
		return batchs;
	}

	private async runInBatch(
		snapshot: firestore.QuerySnapshot<firestore.DocumentData>,
		batchOperation: (
			batch: firestore.WriteBatch,
			doc: firestore.QueryDocumentSnapshot<firestore.DocumentData>
		) => void | Promise<void>
	) {
		const batchAmount = Math.ceil(snapshot.size / this.maxBatchOperations);
		const batchs = this.createBatchs(batchAmount);

		return await Promise.all(
			batchs.map((batch, index) => {
				const sliceStart = index * this.maxBatchOperations;
				const sliceEnd = sliceStart + this.maxBatchOperations;
				const docs = snapshot.docs.slice(sliceStart, sliceEnd);
				docs.forEach((doc) => batchOperation(batch, doc));
				return batch.commit();
			})
		);
	}

	async removeFieldFromPlants(fieldName: string) {
		const querySnapshot = await db.collection(this.collectionName).where(fieldName, ">", "").get();

		await this.runInBatch(querySnapshot, (batch, doc) => {
			batch.update(doc.ref, { [fieldName]: firestore.FieldValue.delete() });
		});
	}
}
