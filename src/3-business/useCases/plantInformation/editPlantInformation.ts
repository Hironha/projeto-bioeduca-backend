import { Left, Right, type Either } from "@utils/flow";
import { Exception } from "@utils/exception";

import { EditPlantInformationDTO } from "@business/dtos/plantInformation/editPlantInformation";
import { type IEditPlantInformationDTOOutput } from "@business/interfaces/ios/plantInformation/editPlantInformation";

import { PlantInformationRepository } from "@data/repositories/plantInformation";
import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";
import { type PlantInformationModel } from "@data/models/plantInformation";
import { type IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";

import { editPlantInformationException as exceptions } from "./exceptions/editPlantInformation";

export class EditPlantInformationUseCase {
	constructor(private plantInformationRepository = new PlantInformationRepository()) {}

	async exec(dto: EditPlantInformationDTO): Promise<IPlantInformationModel> {
		try {
			const createEditFlow = await this.createEntity(dto);
			if (createEditFlow.isLeft()) throw createEditFlow.export();
			const { id, ...editData } = createEditFlow.export();

			const editPlantInformationFlow = await this.editPlantInformation(id, editData);
			if (editPlantInformationFlow.isLeft()) throw editPlantInformationFlow.export();
			const editedPlantInformation = editPlantInformationFlow.export();

			return editedPlantInformation.export();
		} catch (err) {
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	private async createEntity(
		dto: EditPlantInformationDTO
	): Promise<Either<Exception, IEditPlantInformationDTOOutput>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.plantInformationNotFound.edit({ message }));
		}
	}

	private async editPlantInformation(
		id: string,
		editData: Partial<IPlantInformationEntity>
	): Promise<Either<Exception, PlantInformationModel>> {
		try {
			const editedPlantInformation = await this.plantInformationRepository.edit(id, editData);
			return new Right(editedPlantInformation);
		} catch (err) {
			return new Left(exceptions.dbError);
		}
	}
}
