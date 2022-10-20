import { Left, Right, type Either } from "@utils/flow";
import { Exception } from "@utils/exception";
import { type IUseCase } from "@utils/useCase";

import { type ConsultPlantDTO } from "@business/dtos/plant/consultPlant";
import type {
	IConsultPlantOutput,
	IConsultPlantDTOInput,
} from "@business/interfaces/ios/plant/consultPlant";

import { PlantRepository } from "@data/repositories/plant";
import { type PlantModel } from "@data/models/plant";

import { consultPlantExceptions as exceptions } from "./exceptions/consultPlant";

export class ConsultPlantUseCase implements IUseCase<ConsultPlantDTO, IConsultPlantOutput> {
	constructor(private plantRepository = new PlantRepository()) {}

	async exec(dto: ConsultPlantDTO): Promise<IConsultPlantOutput> {
		try {
			const getInputDataFlow = await this.getInputData(dto);
			if (getInputDataFlow.isLeft()) throw getInputDataFlow.export();
			const { plantId } = getInputDataFlow.export();

			const consultPlantFlow = await this.consultPlantById(plantId);
			if (consultPlantFlow.isLeft()) throw consultPlantFlow.export();
			const plant = consultPlantFlow.export();

			return plant.export();
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async getInputData(
		dto: ConsultPlantDTO
	): Promise<Either<Exception, IConsultPlantDTOInput>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async consultPlantById(id: string): Promise<Either<Exception, PlantModel>> {
		try {
			const plant = await this.plantRepository.consultById(id);
			if (!plant) return new Left(exceptions.plantNotFound);
			return new Right(plant);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
