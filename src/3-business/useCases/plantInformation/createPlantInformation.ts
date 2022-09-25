import { Exception } from "@utils/exception";
import { Left, Right, type Either } from "@utils/flow";
import { type IUseCase } from "@utils/useCase";

import { type CreatePlantInformationDTO } from "@business/dtos/plantInformation/createPlantInformation";
import { type ICreatePlantInformationOutput } from "@business/interfaces/ios/plantInformation/createPlantInformation";

import { PlantInformationModel } from "@data/models/plantInformation";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { type IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";

import { createPlantInformationExceptions as exceptions } from "./exceptions/createPlantInformation";

export class CreatePlantInformationUseCase
	implements IUseCase<CreatePlantInformationDTO, ICreatePlantInformationOutput>
{
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
	): Promise<Either<Exception, IPlantInformationEntity>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(new Exception(exceptions.inputValidation).edit({ message }));
		}
	}

	private async createPlantInformation(
		entity: IPlantInformationEntity
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
