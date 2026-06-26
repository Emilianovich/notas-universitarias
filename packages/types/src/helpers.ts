export type RemoveSpecificStrings = {
	value: string
	stringsToRemove: string[]
}

export type PersonFullName = {
	firstName: string
	secondName?: string
	thirdName?: string
	lastName: string
	secondLastName?: string
}

export type RemoveElementType<T> = {
	array: T[]
	index: number
}

type BaseLanguage =
	| "en"
	| "es"
	| "fr"
	| "de"
	| "it"
	| "pt"
	| "zh"
	| "ja"
	| "ko"
	| "ru"
	| "ar"
	| "nl"
	| "sv"
	| "no"
	| "da"
	| "fi"
	| "pl"
	| "tr"
	| "cs"
	| "el"
	| "he"
	| "hi"
	| "th"
	| "vi"
	| "id"
	| "uk"

type Region =
	| "US"
	| "GB"
	| "CA"
	| "AU"
	| "ES"
	| "MX"
	| "AR"
	| "CO"
	| "PA"
	| "FR"
	| "DE"
	| "IT"
	| "BR"
	| "CN"
	| "JP"
	| "KR"
	| "IN"
	| "RU"
	| "TR"
	| "NL"
	| "SE"

export type Locale = BaseLanguage | `${BaseLanguage}-${Region}`
