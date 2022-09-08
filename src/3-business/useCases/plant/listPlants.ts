import { Exception } from "@utils/exception";
import { Left, Right, type Either } from "@utils/flow";

import { ListPlantsDTO } from "@business/dtos/plant/listPlants";
import { type IListPlantsOutput } from "@business/interfaces/ios/plant/listPlants";

import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
import { PlantRepository } from "@data/repositories/plant";
import { type PlantModel } from "@data/models/plant";

import { listPlantsExceptions as exceptions } from "./exceptions/listPlants";

export class ListPlantsUseCase {
	constructor(private readonly plantRepository = new PlantRepository()) {}

	async exec(input: ListPlantsDTO): Promise<IListPlantsOutput> {
		try {
			const createEntityFlow = await this.createEntity(input);
			if (createEntityFlow.isLeft()) throw createEntityFlow.export();
			const listPlantsEntity = createEntityFlow.export();

			const listPlantsFlow = await this.listPlants(listPlantsEntity);
			if (listPlantsFlow.isLeft()) throw listPlantsFlow.export();
			const { hasMore, plantModels } = listPlantsFlow.export();

			const formattedPlantModels = this.formatPlantModels(plantModels);
			const lastPlantModel = formattedPlantModels.at(-1);
			return {
				hasMore,
				lastKey: lastPlantModel ? lastPlantModel.id : undefined,
				data: formattedPlantModels,
			};
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private formatPlantModels(plantModels: PlantModel[]) {
		return plantModels.map((plant) => plant.format());
	}

	private async createEntity(
		dto: ListPlantsDTO
	): Promise<Either<Exception, ListPaginatedInputEntity>> {
		try {
			await dto.validate();
			const input = dto.export();
			return new Right(new ListPaginatedInputEntity(input));
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async listPlants(
		listEntity: ListPaginatedInputEntity
	): Promise<Either<Exception, { hasMore: boolean; plantModels: PlantModel[] }>> {
		try {
			const { hasMore, plantModels } = await this.plantRepository.list(listEntity);
			return new Right({ hasMore, plantModels });
		} catch (err) {
			if (err instanceof Exception) return new Left(err);
			return new Left(exceptions.dbError);
		}
	}
}
