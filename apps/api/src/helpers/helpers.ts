import type {
	CourseBreakdown,
	CourseInstance,
	CourseInstanceDocument,
	CreateCourseInstanceType,
	CreatingCourseInstanceBreakdown,
	UpdateCourseInstanceDto,
	UpdateUserDTO,
	UserDocument
} from "@notas-universitarias/types"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { ObjectId } from "mongodb"
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
	const { name, percentage, allowsMultipleEntries } = breakdown
	return {
		name,
		percentage,
		contribution: 0,
		allowsMultipleEntries,
		entries: []
	}
}

export function mapCreateCourseInstanceToDTO(
	dto: CreateCourseInstanceType
): CourseInstance {
	const { breakdowns, laboratory, profesorName } = dto
	return {
		profesorName,
		finalGrade: 0,
		breakdowns: breakdowns.map(mapBreakdownSchemaToDto),
		...(laboratory && {
			laboratory: {
				...laboratory,
				finalGrade: 0,
				breakdowns: laboratory.breakdowns.map(mapBreakdownSchemaToDto)
			}
		})
	}
}

export function mapUpdateCourseInstance(
	currentCourseInstance: CourseInstance,
	dto: UpdateCourseInstanceDto
): CourseInstance {
	const { profesorName, breakdowns, laboratory } = dto
	return {
		profesorName,
		finalGrade: currentCourseInstance.finalGrade,
		breakdowns,
		...laboratory
	}
}

export function mapInstanceDocToCourseInstance(
	courseInstance: CourseInstanceDocument
): CourseInstance {
	const { _id, ...rest } = courseInstance
	return rest
}

export function mapUpdateUserDtoToUserDocument(
	currentUser: UserDocument,
	dto: UpdateUserDTO
): UserDocument {
	return {
		name: dto.name ?? currentUser.name,
		password: dto.password ?? currentUser.password,
		email: dto.email.toLowerCase() ?? currentUser.email,
		preferences: {
			petName: dto.petName ?? currentUser.preferences.petName,
			theme: dto.theme ?? currentUser.preferences.theme,
			fontFamily: dto.fontFamily ?? currentUser.preferences.fontFamily,
			disablePet: dto.disablePet ?? currentUser.preferences.disablePet
		}
	}
}

export function prepareBreakdowns(breakdown: CourseBreakdown): CourseBreakdown {
	breakdown.percentage *= 100
	breakdown.contribution *= 100
	return breakdown
}
export function prepareCourseInstance(
	instance: CourseInstance
): CourseInstance {
	const { laboratory, profesorName, finalGrade } = instance
	const breakdowns = instance.breakdowns.map(prepareBreakdowns)
	if (laboratory) {
		laboratory.breakdowns.forEach(prepareBreakdowns)
	}
	return {
		profesorName,
		finalGrade,
		breakdowns,
		...(laboratory && {
			laboratory: {
				...laboratory
			}
		})
	}
}
