import type {
	Course,
	CourseBreakdown,
	CourseBreakdownEntry,
	CourseInstance,
	GradeLetter,
	PersonFullName,
	RemoveElementType,
	RemoveSpecificStrings
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
}): number => Number(number.toFixed(amountOfDecimals))

export function getValueOver100({
	rawScore,
	maxScore = 100
}: {
	rawScore: number
	maxScore?: number
}): number {
	return (rawScore / maxScore) * 100
}

// function updateObtainedPercentage(courseBreakdown: CourseBreakdown) : void {
// 	// Procedure for when the breakdown is a laboratory (Physics, Chemistry, etc.).
// 	// Each laboratory for these subjects has its own teacher and course breakdown
// 	// These breakdowns SHOULD NOT have laboratory details !!!
// 	if (courseBreakdown.laboratoryDetails) {
// 		let labTotal = 0
// 		courseBreakdown.laboratoryDetails.breakdown.forEach((labBreakdown) => {
// 			updateObtainedPercentage(labBreakdown);
// 			labTotal += labBreakdown.contribution
// 		})
// 		courseBreakdown.contribution = (labTotal  * courseBreakdown.percentage )
// 		return
// 	}
// 	let total = 0
// 	courseBreakdown.entries.forEach(entry => {
// 		total += getValueOver100({ rawScore: entry.rawScore, maxScore: entry.maxScore })
// 	})
// 	courseBreakdown.contribution = ((total / courseBreakdown.entries.length) * courseBreakdown.percentage) / 100
// }
//
// export function updateCourseInstanceGrade(courseInstance: CourseInstance) : void {
// 	courseInstance.breakdown.forEach(breakdown => {
// 		if (breakdown.laboratoryDetails) {
// 			updateCourseInstanceGrade(breakdown.laboratoryDetails)
// 		}
// 		updateObtainedPercentage(breakdown)
// 		courseInstance.finalGrade += (breakdown.contribution * 100)
// 	})
// 	courseInstance.finalGrade = roundNumber({ number: courseInstance.finalGrade, amountOfDecimals: 2 })
// 	console.log(courseInstance)
// }
//
// export function updateCourseAverageGrade(course: Course) : void {
// 	course.courseInstances.forEach(courseInstance => {
// 		updateCourseInstanceGrade(courseInstance)
// 		course.averageGrade += courseInstance.finalGrade
// 	})
// 	course.averageGrade /= course.courseInstances.length
// 	course.averageGrade = roundNumber({ number: course.averageGrade, amountOfDecimals: 2 })
// }

function getEntriesAverageGrade(entries: CourseBreakdownEntry[]): number {
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

function getBreakdownContribution(breakdown: CourseBreakdown) {
	if (!breakdown.entries.length) {
		breakdown.contribution = 0
	}
	const entryAverage = getEntriesAverageGrade(breakdown.entries)
	breakdown.contribution = (breakdown.percentage * entryAverage) / 100
}

function getCourseInstanceBreakdownContribution(breakdown: CourseBreakdown) {
	if (breakdown.type !== "NESTED") {
		getBreakdownContribution(breakdown)
		return
	}
	if (breakdown.laboratoryDetails) {
		breakdown.laboratoryDetails.breakdown.forEach((detail) => {
			getBreakdownContribution(detail)
		})
		breakdown.laboratoryDetails.finalGrade =
			breakdown.laboratoryDetails.breakdown
				.map((instance) => instance.contribution)
				.reduce((currentContribution, acc) => currentContribution + acc, 0)
		breakdown.contribution =
			breakdown.laboratoryDetails.finalGrade * breakdown.percentage
	}
}

export function updateCourseInstanceFinalGrade(
	courseInstance: CourseInstance
): void {
	courseInstance.breakdown.forEach((breakdown) => {
		getCourseInstanceBreakdownContribution(breakdown)
	})
	courseInstance.finalGrade = roundNumber({
		number: courseInstance.breakdown
			.map((instance) => instance.contribution)
			.reduce((currentContribution, acc) => currentContribution + acc, 0),
		amountOfDecimals: 4
	})
}

export function updateCourseAverageGrade(course: Course): void {
	course.courseInstances.forEach((instance) => {
		updateCourseInstanceFinalGrade(instance)
	})
	course.averageGrade = roundNumber({
		number:
			course.courseInstances
				.map((instance) => instance.finalGrade)
				.reduce((currentFinalGrade, acc) => currentFinalGrade + acc, 0) /
			course.courseInstances.length,
		amountOfDecimals: 4
	})
}
