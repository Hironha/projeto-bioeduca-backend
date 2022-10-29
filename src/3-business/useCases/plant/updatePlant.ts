import { Left, Right, type Either } from "@utils/flow";
import { Exception } from "@utils/exception";
import { type IUseCase } from "@utils/useCase";

import { validatePlantFields } from "@business/useCases/plant/common/validatePlantFields";
import { type UpdatePlantDTO } from "@business/dtos/plant/updatePlant";
import {
	type IUpdatePlantDTOOutput,
	type IUpdatePlantOutput,
} from "@business/interfaces/ios/plant/updatePlant";

import { PlantRepository } from "@data/repositories/plant";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { type PlantModel } from "@data/models/plant";
import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { type PlantInformationModel } from "@data/models/plantInformation";

import { createPlantExceptions as exceptions } from "./exceptions/createPlant";

export class UpdatePlantUseCase implements IUseCase<UpdatePlantDTO, IUpdatePlantOutput> {
	constructor(
		private readonly plantRepository = new PlantRepository(),
		private readonly plantInformationRepository = new PlantInformationRepository()
	) {}

	async exec(input: UpdatePlantDTO): Promise<IUpdatePlantOutput> {
		try {
			const validateDTOResult = await this.validateDTO(input);
			if (validateDTOResult.isLeft()) throw validateDTOResult.export();
			const { id: updatePlantId, ...newPlantData } = validateDTOResult.export();

			if (newPlantData.additional_informations) {
				const validationResult = await this.validatePlantFields(
					newPlantData.additional_informations
				);
				if (validationResult.isLeft()) {
					throw validationResult.export();
				}
			}

			const updateResult = await this.updatePlant(updatePlantId, newPlantData);
			if (updateResult.isLeft()) throw updateResult.export();
			const plantModel = updateResult.export();

			return plantModel.export();
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async validateDTO(
		dto: UpdatePlantDTO
	): Promise<Either<Exception, IUpdatePlantDTOOutput>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async updatePlant(
		id: string,
		data: Partial<Omit<IPlantEntity, "created_at">>
	): Promise<Either<Exception, PlantModel>> {
		try {
			const plantModel = await this.plantRepository.updateById(id, data);
			return new Right(plantModel);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async getAllPlantInformations(): Promise<Either<Exception, PlantInformationModel[]>> {
		try {
			const storedFields = await this.plantInformationRepository.listAll();
			return new Right(storedFields);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async validatePlantFields(
		fields: IPlantEntity["additional_informations"]
	): Promise<Either<Exception, null>> {
		try {
			const plantInformationsResult = await this.getAllPlantInformations();
			if (plantInformationsResult.isLeft()) throw plantInformationsResult.export();
			const plantInformations = plantInformationsResult.export();

			const result = await validatePlantFields(fields, plantInformations);

			if (!result.valid) {
				return new Left(exceptions.inputValidation.edit({ message: result.message }));
			}

			return new Right(null);
		} catch (err) {
			if (err instanceof Exception) return new Left(err);
			return new Left(exceptions.inputValidation);
		}
	}
}
