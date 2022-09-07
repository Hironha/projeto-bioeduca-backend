import { Exception } from "@utils/exception";
import { Left, Right, type Either } from "@utils/flow";

import { type ListPlantInfomationsDTO } from "@business/dtos/plantInformation/listPlantInformations";
import { type IListPlantInformationsOutput } from "@business/interfaces/ios/plantInformation/listPlantInformation";

import { PlantInformationModel } from "@data/models/plantInformation";
import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";

import { listPlantInformationsExceptions as exceptions } from "./exceptions/listPlantInformations";

export class ListPlantInformationsUseCase {
	constructor(private readonly plantInformationRepository = new PlantInformationRepository()) {}

	async exec(input: ListPlantInfomationsDTO): Promise<IListPlantInformationsOutput> {
		try {
			const getEntityFlow = await this.getEntity(input);
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

	async getEntity(
		dto: ListPlantInfomationsDTO
	): Promise<Either<Exception, ListPaginatedInputEntity>> {
		try {
			await dto.validate();
			const entity = new ListPaginatedInputEntity({ perPage: 10000 });
			return new Right(entity);
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}

	async listPlantInformations(
		entity: ListPaginatedInputEntity
	): Promise<Either<Exception, PlantInformationModel[]>> {
		try {
			const plantInformations = await this.plantInformationRepository.list(entity);
			return new Right(plantInformations);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
