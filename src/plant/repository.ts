import { db } from "@core/firebase";
import * as Model from "./model";
import { type PlantEntity } from "./entity";
import { PlantException } from "./exception";

export type ListPlantsQuery = {
  perPage: number;
  lastKey?: string;
};

export type PlantsList = {
  hasMore: boolean;
  items: PlantEntity[];
  lastKey?: string;
};

export class FirebasePlantRepository {
  public static readonly Collection = "plants";

  /**
   * @throws {PlantException}
   */
  async create(entity: PlantEntity): Promise<void> {
    try {
      const doc = db.collection(FirebasePlantRepository.Collection).doc(entity.id);
      const model = Model.fromEntity(entity);
      await doc.set(model);
    } catch (e) {
      console.error("Unexpected create error at firebase plant repository: ", e);
      throw PlantException.db();
    }
  }

  async find(id: string): Promise<PlantEntity | undefined> {
    try {
      const snapshot = await db.collection(FirebasePlantRepository.Collection).doc(id).get();
      const model = snapshot.data() as Model.PlantModel | undefined;
      if (!snapshot.exists || !model) {
        return undefined;
      }

      return Model.toEntity(model);
    } catch (e) {
      console.error("Unexpected find error at firebase plant repository: ", e);
      throw PlantException.db();
    }
  }

  /**
   * @throws {PlantException}
   */
  async list(query: ListPlantsQuery): Promise<PlantsList> {
    try {
      const collection = db.collection(FirebasePlantRepository.Collection);
      // always query +1 so we can tell if there is more items
      let dbquery = collection.limit(query.perPage + 1).orderBy("created_at", "desc");
      if (query.lastKey) {
        const last = await collection.doc(query.lastKey).get();
        if (last.exists) {
          dbquery = dbquery.startAfter(last);
        }
      }

      const snapshot = await dbquery.get();
      const queried = snapshot.docs.slice(0, query.perPage);
      const entities = queried.map((doc) => Model.toEntity(doc.data() as Model.PlantModel));
      return {
        hasMore: snapshot.size > entities.length,
        items: entities,
        lastKey: entities.at(-1)?.id,
      };
    } catch (e) {
      console.error("Unexpected list error at firebase plant repository: ", e);
      throw PlantException.db();
    }
  }

  /**
   * @throws {PlantException}
   */
  async remove(id: string): Promise<PlantEntity> {
    try {
      const doc = db.collection(FirebasePlantRepository.Collection).doc(id);
      const snapshot = await doc.get();
      const model = snapshot.data() as Model.PlantModel | undefined;
      if (!snapshot.exists || !model) {
        throw PlantException.notFound(`Plant with id ${id} could not be found.`);
      }

      await doc.delete();
      return Model.toEntity(model);
    } catch (e) {
      console.error("Unexpected remove error at firebase plant repository: ", e);
      throw PlantException.db();
    }
  }

  /**
   * @throws {PlantException}
   */
  async update(entity: PlantEntity): Promise<void> {
    try {
      const model = Model.fromEntity(entity);
      const doc = db.collection(FirebasePlantRepository.Collection).doc(model.id);
      const snapshot = await doc.get();
      if (!snapshot.exists) {
        throw PlantException.notFound(`Plant with id ${model.id} could not be found.`);
      }

      await doc.update(model);
    } catch (e) {
      console.error("Unexpected remove error at firebase plant repository: ", e);
      throw PlantException.db();
    }
  }
}
