import { Left, Right, type Either } from "@utils/flow";
import { isString } from "class-validator";
import { Exception } from "@utils/exception";

import { type CreatePlantDTO } from "@business/dtos/plant/createPlant";
import { type ICreatePlantOutput } from "@business/interfaces/ios/plant/createPlant";

import { type PlantModel } from "@data/models/plant";
import { type PlantInformationModel } from "@data/models/plantInformation";
import { PlantEntity } from "@data/entities/plant";
import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
import { PlantRepository } from "@data/repositories/plant";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { PlantInformationValidations } from "@data/interfaces/entities/plantInformation";

import { createPlantExceptions as exceptions } from "./exceptions/createPlant";

export class CreatePlantUseCase {
	constructor(
		private readonly plantRepository = new PlantRepository(),
		private readonly plantInformationRepository = new PlantInformationRepository()
	) {}

	async exec(input: CreatePlantDTO): Promise<ICreatePlantOutput> {
		try {
			const createPlantEntityFlow = await this.createEntity(input);
			if (createPlantEntityFlow.isLeft()) throw createPlantEntityFlow.export();
			const plantEntity = createPlantEntityFlow.export();

			const getPlantInformationsFlow = await this.getAllPlantInformations();
			if (getPlantInformationsFlow.isLeft()) throw getPlantInformationsFlow.export();
			const plantInformations = getPlantInformationsFlow.export();

			const validatePlantFieldsFlow = await this.validatePlantFields(
				plantEntity,
				plantInformations
			);
			if (validatePlantFieldsFlow.isLeft()) throw validatePlantFieldsFlow.export();

			const createPlantFlow = await this.createPlant(plantEntity);
			if (createPlantFlow.isLeft()) throw createPlantFlow.export();
			const plantModel = createPlantFlow.export();

			return plantModel.format();
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async createPlant(plantEntity: PlantEntity): Promise<Either<Exception, PlantModel>> {
		try {
			const plantModel = await this.plantRepository.create(plantEntity);
			return new Right(plantModel);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async createEntity(dto: CreatePlantDTO): Promise<Either<Exception, PlantEntity>> {
		try {
			await dto.validate();
			const input = dto.export();
			const currTimestamp = new Date().getTime();
			const plantEntity = new PlantEntity({
				fields: input.fields,
				images: input.images,
				created_at: currTimestamp,
				updated_at: currTimestamp,
			});
			return new Right(plantEntity);
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async getAllPlantInformations(): Promise<Either<Exception, PlantInformationModel[]>> {
		try {
			const listPaginatedEntity = new ListPaginatedInputEntity({ perPage: 100000 });
			const storedFields = await this.plantInformationRepository.list(listPaginatedEntity);
			return new Right(storedFields);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async validatePlantFields(
		plantEntity: PlantEntity,
		plantInformations: PlantInformationModel[]
	): Promise<Either<Exception, null>> {
		try {
			Object.entries(plantEntity.fields).forEach(([fieldName, value]) => {
				const field = plantInformations.find(
					(plantInformation) => plantInformation.field_name === fieldName
				);
				if (!field) {
					throw exceptions.plantFieldNotFound.edit({
						message: `Could not find a registered plant information for the value: ${value}.`,
					});
				}
				if (!this.validatePlantField(field.validation, value)) {
					throw exceptions.inputValidation.edit({
						message: `The information ${field.field_name} must be ${field.validation}`,
					});
				}
			});

			return new Right(null);
		} catch (err) {
			if (err instanceof Exception) return new Left(err);
			return new Left(exceptions.inputValidation);
		}
	}

	private validatePlantField(fieldValidation: PlantInformationValidations, value: any) {
		switch (fieldValidation) {
			case PlantInformationValidations.STRING:
				return isString(value);
			default:
				return false;
		}
	}
}
