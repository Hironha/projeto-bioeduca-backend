import { Left, Right, type Either } from "@utils/flow";
import { isString } from "class-validator";
import { Exception } from "@utils/exception";
import { type IUseCase } from "@utils/useCase";

import { type CreatePlantDTO } from "@business/dtos/plant/createPlant";
import { type ICreatePlantOutput } from "@business/interfaces/ios/plant/createPlant";

import { type PlantModel } from "@data/models/plant";
import { type PlantInformationModel } from "@data/models/plantInformation";
import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { PlantRepository } from "@data/repositories/plant";
import { PlantInformationRepository } from "@data/repositories/plantInformation";

import { createPlantExceptions as exceptions } from "./exceptions/createPlant";

export class CreatePlantUseCase implements IUseCase<CreatePlantDTO, ICreatePlantOutput> {
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

			return plantModel.export();
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async createPlant(plantEntity: IPlantEntity): Promise<Either<Exception, PlantModel>> {
		try {
			const plantModel = await this.plantRepository.create(plantEntity);
			return new Right(plantModel);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async createEntity(dto: CreatePlantDTO): Promise<Either<Exception, IPlantEntity>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async getAllPlantInformations(): Promise<Either<Exception, PlantInformationModel[]>> {
		try {
			const storedFields = await this.plantInformationRepository.list({ perPage: 1000 });
			return new Right(storedFields);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async validatePlantFields(
		plantEntity: IPlantEntity,
		plantInformations: PlantInformationModel[]
	): Promise<Either<Exception, null>> {
		try {
			Object.entries(plantEntity.additional_informations).forEach(([fieldName, value]) => {
				const field = plantInformations.find(
					(plantInformation) => plantInformation.field_name === fieldName
				);

				if (!field) {
					throw exceptions.plantFieldNotFound.edit({
						message: `Could not find a registered plant information for the field: ${fieldName}.`,
					});
				}

				if (!this.validatePlantField(value)) {
					throw exceptions.inputValidation.edit({
						message: `The information ${field.field_name} must be a string`,
					});
				}
			});

			return new Right(null);
		} catch (err) {
			if (err instanceof Exception) return new Left(err);
			return new Left(exceptions.inputValidation);
		}
	}

	private validatePlantField(value: string) {
		return isString(value);
	}
}
