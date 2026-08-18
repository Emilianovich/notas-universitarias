export default function formatDate(date: Date) {
	return date.toLocaleDateString(navigator.language, { timeZone: "UTC" })
}
