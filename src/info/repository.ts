import { firestore } from "firebase-admin";

import { db } from "@core/firebase";
import { FirebasePlantRepository } from "@plant/repository";
import * as Model from "./model";
import { type InfoEntity } from "./entity";
import { InfoException } from "./exception";

export class FirebaseInfoRepository {
  public static readonly Collection = "plant-informations";

  /**
   * @throws {InfoException}
   */
  async create(entity: InfoEntity): Promise<void> {
    try {
      const model = Model.fromEntity(entity);
      await db.runTransaction(async (trx) => {
        const collection = db.collection(FirebaseInfoRepository.Collection);
        const found = await trx.get(
          collection.where("field_name", "==", model.field_name).limit(1)
        );
        if (!found.empty) {
          throw InfoException.duplicateName();
        }

        trx.create(collection.doc(model.id), model);
      });
    } catch (e) {
      console.error("Unexpected create error at firebase info repository: ", e);
      throw e instanceof InfoException ? e : InfoException.db();
    }
  }

  /**
   * @throws {InfoException}
   */
  async find(infoId: string): Promise<InfoEntity | undefined> {
    try {
      const snapshot = await db.collection(FirebaseInfoRepository.Collection).doc(infoId).get();
      const model = snapshot.data() as Model.InfoModel | undefined;
      if (!snapshot.exists || !model) {
        return undefined;
      }

      return Model.toEntity(model);
    } catch (e) {
      console.error("Unexpected find error at firebase info repository: ", e);
      throw e instanceof InfoException ? e : InfoException.db();
    }
  }

  /**
   * @throws {InfoException}
   */
  async findAll(): Promise<InfoEntity[]> {
    try {
      const snapshot = await db.collection(FirebaseInfoRepository.Collection).get();
      return snapshot.docs.map((doc) => {
        const model = doc.data() as Model.InfoModel;
        return Model.toEntity(model);
      });
    } catch (e) {
      console.error("Unexpected find all error at firebase info repository: ", e);
      throw e instanceof InfoException ? e : InfoException.db();
    }
  }

  /**
   * @throws {InfoException}
   */
  async remove(id: string): Promise<InfoEntity> {
    try {
      const doc = db.collection(FirebaseInfoRepository.Collection).doc(id);
      const snapshot = await doc.get();
      const model = snapshot.data() as Model.InfoModel | undefined;
      if (!snapshot.exists || !model) {
        throw InfoException.notFound(`Plant information with id ${id} could not be found.`);
      }

      await db.runTransaction(async (trx) => {
        const plantsSnapshot = await db
          .collection(FirebasePlantRepository.Collection)
          .where(model.field_name, ">", "")
          .get();

        for (const plantdoc of plantsSnapshot.docs) {
          const field = `additional_informations.${model.field_name}`;
          trx.update(plantdoc.ref, { [field]: firestore.FieldValue.delete() });
        }

        trx.delete(doc);
      });

      return Model.toEntity(model);
    } catch (e) {
      console.error("Unexpected remove error at firebase info repository: ", e);
      throw e instanceof InfoException ? e : InfoException.db();
    }
  }

  /**
   * @throws {InfoException}
   */
  async update(entity: InfoEntity): Promise<void> {
    try {
      const model = Model.fromEntity(entity);
      const doc = db.collection(FirebaseInfoRepository.Collection).doc(model.id);
      const snapshot = await doc.get();
      if (!snapshot.exists) {
        throw InfoException.notFound();
      }

      await doc.update(model);
    } catch (e) {
      console.error("Unexpected update error at firebase info repository: ", e);
      throw e instanceof InfoException ? e : InfoException.db();
    }
  }
}
