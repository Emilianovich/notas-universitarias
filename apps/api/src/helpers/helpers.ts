import type {
	CourseBreakdown,
	CourseInstance
} from "@notas-universitarias/types"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { ObjectId } from "mongodb"
import type {
	CourseInstanceToBeCreated,
	CreatingCourseInstanceBreakdown
} from "../../../../packages/types/src/dtos/courseInstances/createCourseInstances.js"
import type { UpdateCourseInstanceDto } from "../../../../packages/types/src/dtos/courseInstances/updateCourseInstances.js"
import type { CourseInstanceDocument } from "../collection-schema/courseInstances.js"
import type { MiddlewareVars } from "../index.js"
import type { MongoService } from "../modules/db/MongoService.js"

export function getContextVars(ctx: Context<MiddlewareVars>): {
	mongoService: MongoService
	userId: ObjectId
} {
	const mongoService = ctx.get("mongoService")
	const userId = ctx.get("userId")
	return { mongoService, userId }
}

export default function getValidObjectId(val: string | undefined): ObjectId {
	if (!val)
		throw new HTTPException(400, { message: "El id ingresado no es válido" })
	if (!ObjectId.isValid(val))
		throw new HTTPException(400, { message: "El id ingresado no es válido" })
	return new ObjectId(val)
}

function mapBreakdownSchemaToDto(
	breakdown: CreatingCourseInstanceBreakdown
): CourseBreakdown {
	const { name, percentage, type } = breakdown
	return {
		name,
		percentage,
		contribution: 0,
		type,
		entries: []
	}
}

function mapLaboratoryDetails(
	profesorName: string,
	breakdown: CourseBreakdown[]
): CourseInstance {
	return {
		profesorName,
		finalGrade: 0,
		breakdown
	}
}

// OPTIMIZE o(n2) check
export function mapCreateCourseInstanceToDTO(
	dto: CourseInstanceToBeCreated
): CourseInstance {
	const courseBreakdowns: CourseBreakdown[] = dto.breakdown.map((item) => {
		const obj = mapBreakdownSchemaToDto(item)
		if (!item.laboratoryDetails) {
			return obj
		}
		const laboratoryDetailsArray = item.laboratoryDetails.breakdown.map(
			(labDetail) => {
				return mapBreakdownSchemaToDto(labDetail)
			}
		)
		return {
			...obj,
			laboratoryDetails: mapLaboratoryDetails(
				item.laboratoryDetails.profesorName,
				laboratoryDetailsArray
			)
		}
	})
	return {
		profesorName: dto.profesorName,
		finalGrade: 0,
		breakdown: courseBreakdowns
	}
}

export function mapUpdateCourseInstance(
	currentCourseInstance: CourseInstance,
	dto: UpdateCourseInstanceDto
): CourseInstance {
	return {
		profesorName: dto.profesorName ?? currentCourseInstance.profesorName,
		finalGrade: currentCourseInstance.finalGrade,
		breakdown: dto.breakdown ?? currentCourseInstance.breakdown
	}
}

export function mapInstanceDocToCourseInstance(
	courseInstance: CourseInstanceDocument
): CourseInstance {
	const { _id, ...rest } = courseInstance
	return rest
}
