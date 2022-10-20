import { Left, Right, type Either } from "@utils/flow";
import { Exception } from "@utils/exception";
import { type IUseCase } from "@utils/useCase";

import { type DeletePlantDTO } from "@business/dtos/plant/deletePlant";
import {
	type IDeletePlantOutput,
	type IDeletePlantDTOOutput,
} from "@business/interfaces/ios/plant/deletePlant";

import { PlantRepository } from "@data/repositories/plant";
import { type PlantModel } from "@data/models/plant";

import { deletePlantExceptions as exceptions } from "./exceptions/deletePlant";

export class DeletePlantUseCase implements IUseCase<DeletePlantDTO, IDeletePlantOutput> {
	constructor(private plantRepository = new PlantRepository()) {}

	async exec(dto: DeletePlantDTO): Promise<IDeletePlantOutput> {
		try {
			const getDTODataFlow = await this.getDTOData(dto);
			if (getDTODataFlow.isLeft()) throw getDTODataFlow.export();
			const { id: plantId } = getDTODataFlow.export();

			const deletePlantFlow = await this.deletePlant(plantId);
			if (deletePlantFlow.isLeft()) throw deletePlantFlow.export();

			return {};
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async getDTOData(dto: DeletePlantDTO): Promise<Either<Exception, IDeletePlantDTOOutput>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error)?.message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async deletePlant(id: string): Promise<Either<Exception, PlantModel>> {
		try {
			const deletedPlant = await this.plantRepository.deleteById(id);
			return new Right(deletedPlant);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
