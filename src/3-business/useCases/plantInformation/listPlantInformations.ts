import { Exception } from "@utils/exception";
import { Left, Right, type Either } from "@utils/flow";
import { type IUseCase } from "@utils/useCase";

import { type ListPlantInfomationsDTO } from "@business/dtos/plantInformation/listPlantInformations";
import { type IListPlantInformationsOutput } from "@business/interfaces/ios/plantInformation/listPlantInformation";

import { PlantInformationModel } from "@data/models/plantInformation";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

import { listPlantInformationsExceptions as exceptions } from "./exceptions/listPlantInformations";

export class ListPlantInformationsUseCase
	implements IUseCase<ListPlantInfomationsDTO, IListPlantInformationsOutput>
{
	constructor(private readonly plantInformationRepository = new PlantInformationRepository()) {}

	async exec(input: ListPlantInfomationsDTO): Promise<IListPlantInformationsOutput> {
		try {
			const getEntityFlow = await this.createEntity(input);
			if (getEntityFlow.isLeft()) throw getEntityFlow.export();
			const entity = getEntityFlow.export();

			const listPlantInformationsFlow = await this.listPlantInformations(entity);
			if (listPlantInformationsFlow.isLeft()) throw listPlantInformationsFlow.export();
			const plantInformations = listPlantInformationsFlow.export();

			return {
				data: plantInformations,
			};
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async createEntity(
		dto: ListPlantInfomationsDTO
	): Promise<Either<Exception, IListPaginatedEntityInput>> {
		try {
			await dto.validate();
			return new Right({ perPage: 10000 });
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	async listPlantInformations(
		entity: IListPaginatedEntityInput
	): Promise<Either<Exception, PlantInformationModel[]>> {
		try {
			const plantInformations = await this.plantInformationRepository.list(entity);
			return new Right(plantInformations);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
