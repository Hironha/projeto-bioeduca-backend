import { Left, Right, type Either } from "@utils/flow";
import { Exception } from "@utils/exception";
import { type IUseCase } from "@utils/useCase";

import { DeletePlantInformationDTO } from "@business/dtos/plantInformation/deletePlantInformation";
import {
	type IDeletePlantInformationOutput,
	type IDeletePlantInformationDTOOutput,
} from "@business/interfaces/ios/plantInformation/deletePlantInformation";

import { PlantRepository } from "@data/repositories/plant";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { type PlantInformationModel } from "@data/models/plantInformation";

import { deletePlantInformationExceptions as exceptions } from "./exceptions/deletePlantInformation";

export class DeletePlantInformationUseCase
	implements IUseCase<DeletePlantInformationDTO, IDeletePlantInformationOutput>
{
	constructor(
		private plantInformationRepository = new PlantInformationRepository(),
		private plantRepository = new PlantRepository()
	) {}

	async exec(dto: DeletePlantInformationDTO): Promise<IDeletePlantInformationOutput> {
		try {
			const getDTOData = await this.getDTOData(dto);
			if (getDTOData.isLeft()) throw getDTOData.export();
			const { id: plantInformationId } = getDTOData.export();

			const deletePlantInformationFlow = await this.deletePlantInformation(plantInformationId);
			if (deletePlantInformationFlow.isLeft()) throw deletePlantInformationFlow.export();
			const deletedPlantInformation = deletePlantInformationFlow.export();

			const deletePlantInformationFromPlantsFlow = await this.deletePlantInformationFromPlants(
				deletedPlantInformation.field_name
			);
			if (deletePlantInformationFromPlantsFlow.isLeft())
				throw deletePlantInformationFromPlantsFlow.export();

			return {};
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async getDTOData(
		dto: DeletePlantInformationDTO
	): Promise<Either<Exception, IDeletePlantInformationDTOOutput>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async deletePlantInformation(
		id: string
	): Promise<Either<Exception, PlantInformationModel>> {
		try {
			const deletedPlantInformation = await this.plantInformationRepository.deleteById(id);
			return new Right(deletedPlantInformation);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}

	private async deletePlantInformationFromPlants(
		plantInformationName: string
	): Promise<Either<Exception, null>> {
		try {
			await this.plantRepository.removePlantInformationFromAll(plantInformationName);
			return new Right(null);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
