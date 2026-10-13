import type {
	Course,
	CourseBreakdown,
	CourseBreakdownEntry,
	CourseInstance,
	GradeLetter,
	PersonFullName,
	RemoveElementType,
	RemoveSpecificStrings,
	RequestBuilder,
	SuccessRes
} from "@notas-universitarias/types"

export function stringToArray(someString: string): string[] {
	const totalChars = someString.length
	const stringArray: string[] = []
	for (let i = 0; i < totalChars; i++) {
		stringArray.push(someString.charAt(i))
	}
	return stringArray
}

// Convert a string array to single string
export function arrayToString(someStringArray: string[]) {
	let finalString = ""
	for (let i = 0; i < someStringArray.length; i++) {
		finalString += someStringArray[i]
	}
	return finalString
}

// Meant for abbreviating names?
export const stringSlicer = (someString: string) => {
	if (someString.length < 25) return someString
	return `${someString.slice(0, 25)}.`
}

// Remove a specific set of characters from a string
export const removeCharsFromString = ({
	value,
	stringsToRemove
}: RemoveSpecificStrings): string => {
	stringsToRemove.forEach((string) => {
		value = value.replace(`${string}`, "")
	})
	return value
}

// Remove an element at a specified index
export function removeElementAt<T>(params: RemoveElementType<T>) {
	const { array, index } = params
	array.splice(index, 1)
}

// Remove excess white space from a String (things like Hi  I am   Peter, gets converted to Hi I am Peter)
export const whiteSpaceReducer = (string: string) => {
	const stringArray = stringToArray(string)
	stringArray.forEach((char, i) => {
		if (char === " " && stringArray[i + 1] === " ")
			removeElementAt({ array: stringArray, index: i })
	})
	return arrayToString(stringArray)
}

// Get a person's fullName abbreviated properly
export const nameSlicer = (person: PersonFullName) => {
	const secondNameInitial = person.secondName
		? `${person.secondName.charAt(0).toUpperCase()}.`
		: ""

	const thirdNameInitial = person.thirdName
		? ` ${person.thirdName.charAt(0).toUpperCase()}.`
		: ""

	const secondLastName = person.secondLastName
		? ` ${person.secondLastName}`
		: ""

	const fullName = `${person.firstName} ${secondNameInitial}${thirdNameInitial} ${person.lastName}${secondLastName}`

	return whiteSpaceReducer(fullName)
}

// Get formatted date for user depending on device/browser settings
export const formatDate = (date: Date): string => {
	const userLocale = Intl.DateTimeFormat().resolvedOptions().locale
	return new Intl.DateTimeFormat(userLocale).format(date)
}

export const gradeToLetter = (grade: number): GradeLetter => {
	if (grade < 61) return "F"
	if (grade < 71) return "D"
	if (grade < 81) return "C"
	if (grade < 91) return "B"
	return "A"
}

export type DatesParams = {
	date: number
	units: DateUnits
	amount: number
}
export type DateUnits = "days" | "hour" | "min" | "s" | "ms"
export type ConvertTimeUnits = {
	amount: number
	from: DateUnits
	to: DateUnits
}
export const convertToMillis = ({
	amount,
	units
}: {
	amount: number
	units: DateUnits
}): number => {
	switch (units) {
		case "days":
			return amount * 24 * 60 * 60 * 1000
		case "hour":
			return amount * 60 * 60 * 1000
		case "min":
			return amount * 60 * 1000
		case "s":
			return amount * 1000
		case "ms":
			return amount
	}
}
export const convertToSeconds = ({
	amount,
	units
}: {
	amount: number
	units: DateUnits
}) => {
	switch (units) {
		case "days":
			return amount * 24 * 60 * 60
		case "hour":
			return amount * 60 * 60
		case "min":
			return amount * 60
		case "s":
			return amount
		case "ms":
			return amount / 1000
	}
}
export const addDate = ({ date, amount, units }: DatesParams): number => {
	switch (units) {
		case "days":
			return date + convertToMillis({ amount, units: "days" })
		case "hour":
			return date + convertToMillis({ amount, units: "hour" })
		case "min":
			return date + convertToMillis({ amount, units: "min" })
		case "s":
			return date + convertToMillis({ amount, units: "s" })
		case "ms":
			return date + convertToMillis({ amount, units: "ms" })
	}
}
export const roundNumber = ({
	number,
	amountOfDecimals
}: {
	number: number
	amountOfDecimals: number
}): number => {
	if (!Number.isInteger(amountOfDecimals) || amountOfDecimals < 0) {
		throw new RangeError("The amount must be a non-negative integer")
	}
	const shifted = Number(`${number}e${amountOfDecimals}`)
	const rounded = Math.round(shifted)
	return Number(`${rounded}e-${amountOfDecimals}`)
}

export function getValueOver100({
	rawScore,
	maxScore = 100
}: {
	rawScore: number
	maxScore?: number
}): number {
	return (rawScore / maxScore) * 100
}

export function getEntriesAverageGrade(
	entries: CourseBreakdownEntry[]
): number {
	if (!entries.length) return 0
	const gradeAverage: number[] = []
	entries.forEach((entry) => {
		gradeAverage.push(getValueOver100(entry))
	})
	return (
		gradeAverage.reduce((currentVal, acc) => currentVal + acc, 0) /
		gradeAverage.length
	)
}
export function computeBreakdownContribution(breakdown: CourseBreakdown) {
	if (!breakdown.entries.length) {
		breakdown.contribution = 0
	}
	const entryAverage = getEntriesAverageGrade(breakdown.entries)
	breakdown.contribution = breakdown.percentage * (entryAverage / 100)
}

export function computeCourseInstanceFinalGrade(instance: CourseInstance) {
	instance.finalGrade = instance.breakdowns
		.map((currInstance) => currInstance.contribution)
		.reduce((currentContribution, acc) => currentContribution + acc, 0)
}
export function updateCourseInstanceFinalGrade(
	courseInstance: CourseInstance
): void {
	let labContribution = 0
	const { laboratory } = courseInstance
	if (laboratory) {
		const { breakdowns: labBreakdowns } = laboratory
		labBreakdowns.forEach((breakdown) => {
			computeBreakdownContribution(breakdown)
		})
		computeCourseInstanceFinalGrade(laboratory)
		const { finalGrade: labFinalGrade, percentage } = laboratory
		labContribution = labFinalGrade * percentage
	}
	courseInstance.breakdowns.forEach((breakdown) => {
		computeBreakdownContribution(breakdown)
		computeCourseInstanceFinalGrade(courseInstance)
	})
	courseInstance.finalGrade += labContribution
	courseInstance.finalGrade = roundNumber({
		number: courseInstance.finalGrade,
		amountOfDecimals: 4
	})
}

export function updateCourseAverageGrade(course: Course): void {
	course.courseInstances.forEach((instance) => {
		updateCourseInstanceFinalGrade(instance)
	})
	const { courseInstances } = course
	course.averageGrade = roundNumber({
		number:
			courseInstances
				.map((instance) => instance.finalGrade)
				.reduce((currentFinalGrade, acc) => currentFinalGrade + acc, 0) /
			courseInstances.length,
		amountOfDecimals: 4
	})
}

// TODO add zod validation to res
export async function buildRequest<T, U>({
	method,
	path,
	reqBody,
	includeCredentials,
	baseUrl
}: RequestBuilder): Promise<SuccessRes<T>> {
	const url = `${baseUrl}${path}`
	 const req = await fetch(url, {
		 method,
		 credentials: includeCredentials ? "include" : "omit",
		 headers: {
		 	...(reqBody && {
				 "Content-Type": "application/json"
			}),
			 "Accept": "application/json"
		 },
	 	...(reqBody && {
			 body: JSON.stringify(reqBody),
		})
	 })
	return getResponse<U>(req)
}

export class ServerErrorRes<T> extends Error {
	errors: T
	constructor(message: T) {
		super(JSON.stringify(message))
		this.name = "ServerErrorRes"
		this.errors = message
		Object.setPrototypeOf(this, ServerErrorRes.prototype)
	}
}

export async function getResponse<T>(req: Response) {
	const res = await req.json()
	if (req.ok) return res
	throw new ServerErrorRes<T>(res.errors)
}

export function getLastElementFromArray<T>(array: T[]) {
	return array[array.length - 1]
}

export function isArrayEmpty<T>(array: T[]) {
	return array.length === 0
}
type NonEmptyObject<T extends object> = keyof T extends never ? never : T
export function copyObject<T extends object>(object: T & NonEmptyObject<T>) {
	return { ...object }
}

export function copyArray<T>(array: T[]) {
	return [...array]
}

export function mapBreakdownForDemo(breakdown : Omit<CourseBreakdown, "contribution">) {
	return {
		...breakdown,
		contribution: 0,
	}
}

export function mapBreakdownsForDemo(breakdowns : Omit<CourseBreakdown, "contribution">[]) : CourseBreakdown[] {
	return breakdowns.map(mapBreakdownForDemo)
}