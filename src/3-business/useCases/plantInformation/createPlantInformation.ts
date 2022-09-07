import { Exception } from "@utils/exception";
import { Left, Right, type Either } from "@utils/flow";

import { type CreatePlantInformationDTO } from "@business/dtos/plantInformation/createPlantInformation";

import { PlantInformationEntity } from "@data/entities/plantInformation";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { PlantInformationModel } from "@data/models/plantInformation";

import { type ICreatePlantInformationOutput } from "@business/interfaces/ios/plantInformation/createPlantInformation";

import { createPlantInformationExceptions as exceptions } from "./exceptions/createPlantInformation";

export class CreatePlantInformationUseCase {
	constructor(private readonly plantInformationRepository = new PlantInformationRepository()) {}

	async exec(input: CreatePlantInformationDTO): Promise<ICreatePlantInformationOutput> {
		try {
			const validateInputFlow = await this.getEntity(input);
			if (validateInputFlow.isLeft()) throw validateInputFlow.export();
			const plantInformationEntity = validateInputFlow.export();

			const createPlantInformationFlow = await this.createPlantInformation(plantInformationEntity);
			if (createPlantInformationFlow.isLeft()) throw createPlantInformationFlow.export();
			const createdPlantInformation = createPlantInformationFlow.export();

			return { ...createdPlantInformation.export() };
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async getEntity(
		dto: CreatePlantInformationDTO
	): Promise<Either<Exception, PlantInformationEntity>> {
		try {
			await dto.validate();
			const inputData = dto.export();
			const currTimestamp = new Date().getTime();
			const entity = new PlantInformationEntity({
				...inputData,
				created_at: currTimestamp,
				updated_at: currTimestamp,
			});
			return new Right(entity);
		} catch (err) {
			const message = (err as Error).message;
			return new Left(new Exception(exceptions.inputValidation).edit({ message }));
		}
	}

	private async createPlantInformation(
		entity: PlantInformationEntity
	): Promise<Either<Exception, PlantInformationModel>> {
		try {
			const createdPlantInformation = await this.plantInformationRepository.create(entity);
			return new Right(createdPlantInformation);
		} catch (err) {
			if (err instanceof Left<Exception>) return err;
			if ((err as Exception)?.code === "duplicated-field_name") {
				return new Left(exceptions.duplicatedFieldName);
			}
			return new Left(exceptions.dbError);
		}
	}
}
