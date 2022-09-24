import { Exception } from "@utils/exception";
import { Right, Left, type Either } from "@utils/flow";
import { type IUseCase } from "@utils/useCase";

import { type ListPlantsPreviewDTO } from "@business/dtos/plant/listPlantsPreview";
import { type IListPlantsPreviewOutput } from "@business/interfaces/ios/plant/listPlantsPreview";

import { PlantRepository } from "@data/repositories/plant";
import { type PlantPreviewModel } from "@data/models/plantPreview";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

import { listPlantsPreviewExceptions as exceptions } from "./exceptions/listPlantsPreview";

export class ListPlantsPreviewUseCase
	implements IUseCase<ListPlantsPreviewDTO, IListPlantsPreviewOutput>
{
	constructor(private plantRepository = new PlantRepository()) {}

	async exec(dto: ListPlantsPreviewDTO): Promise<IListPlantsPreviewOutput> {
		try {
			const createEntityFlow = await this.createEntity(dto);
			if (createEntityFlow.isLeft()) throw createEntityFlow.export();
			const listPaginatedEntity = createEntityFlow.export();

			const listPlantPreviewsFlow = await this.listPlantPreviews(listPaginatedEntity);
			if (listPlantPreviewsFlow.isLeft()) throw listPlantPreviewsFlow.export();
			const { hasMore, plantPreviewModels } = listPlantPreviewsFlow.export();

			const lastPlantPreviewModel = plantPreviewModels.at(-1);

			return {
				lastKey: lastPlantPreviewModel?.id,
				hasMore,
				data: plantPreviewModels.map((plantPreview) => plantPreview.export()),
			};
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async createEntity(
		dto: ListPlantsPreviewDTO
	): Promise<Either<Exception, IListPaginatedEntityInput>> {
		try {
			await dto.validate();
			const listPaginatedEntity = dto.export();
			return new Right(listPaginatedEntity);
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	private async listPlantPreviews(
		listPaginatedEntity: IListPaginatedEntityInput
	): Promise<Either<Exception, { hasMore: boolean; plantPreviewModels: PlantPreviewModel[] }>> {
		try {
			const { hasMore, plantPreviewModels } = await this.plantRepository.listPreview(
				listPaginatedEntity
			);
			return new Right({ hasMore, plantPreviewModels });
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
