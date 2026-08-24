export type CourseBreakdownEntry = {
	name?: string
	rawScore: number
	maxScore: number
}

export type CourseBreakdown = {
	name: string
	percentage: number
	contribution: number
	entries: CourseBreakdownEntry[]
	laboratoryDetails?: CourseInstance
	type: BreakdownCategory
}

export type CourseInstance = {
	profesorName: string
	finalGrade: number
	breakdown: CourseBreakdown[]
}

export type Course = {
	name: string
	averageGrade: number
	courseInstances: CourseInstance[]
}

export type BreakdownCategory = "STANDALONE" | "NESTED" | "NOT-NESTED"

export type AcademicPeriod = {
	name: string
	startDate: Date
	endDate: Date
}

export type ValidCollections =
	| "users"
	| "sessions"
	| "academicPeriods"
	| "courseInstances"
	| "courses"
	| "migrations"
export type UserPreferences = {
	fontFamily: FontFamily
	theme: AppTheme
	petName: PetName
}
export type FontFamily =
	| "Arima"
	| "Amiko"
	| "Playwrite VN"
	| "Elsie"
	| "Libertinus Math"
	| "Nunito"
	| "Gorditas"
	| "Special Elite"
	| "Short Stack"
	| "Uncial Antiqua"
	| "Saira Stencil"
	| "Cherry Cream Soda"
	| "Audiowide"
	| "Cabin Sketch"
	| "Chalkboard SE"
	| "Fredoka"
	| "Erzieherisch"
export type AppTheme = "dark" | "light"
export type PetName = "Spike" | "Leon" | "Tom" | "Nita" | "Mila"
export type CurrentAcademicPeriod = {
	name: string
	startDate: Date
	endDate: Date
	courseInstances: CurrentAcademicPeriodSubjects[]
	isActive: boolean
}
export type CurrentAcademicPeriodSubjects = {
	id: string
	name: string
}
