import { describe, expect, test } from "vitest"
import { updateCourseInstanceSchema } from "./updateCourseInstances"

const validBreakdown = {
	name: "Final Exam",
	percentage: 100,
	allowsMultipleEntries: false,
	contribution: 85,
	entries: [
		{
			name: "Final Exam",
			rawScore: 85,
			maxScore: 100
		}
	]
}

const testCases = [
	// 1
	{
		description: "1. Rejects an empty professor name",
		expected: false,
		fixture: {
			profesorName: "",
			breakdown: [validBreakdown]
		}
	},

	// 2
	{
		description: "2. Rejects a professor name longer than 100 characters",
		expected: false,
		fixture: {
			profesorName: "P".repeat(101),
			breakdown: [validBreakdown]
		}
	},

	// 3
	{
		description: "3. Accepts a professor name within the allowed length",
		expected: true,
		fixture: {
			profesorName: "Ana Rodríguez",
			breakdown: [validBreakdown]
		}
	},

	// 4
	{
		description: "4. Rejects breakdown percentages exceeding 100%",
		expected: false,
		fixture: {
			profesorName: "Ana Rodríguez",
			breakdown: [
				{
					...validBreakdown,
					percentage: 60
				},
				{
					...validBreakdown,
					name: "Midterm Exam",
					percentage: 50
				}
			]
		}
	},

	// 5
	{
		description: "5. Accepts breakdown percentages totaling 100%",
		expected: true,
		fixture: {
			profesorName: "Ana Rodríguez",
			breakdown: [
				{
					...validBreakdown,
					percentage: 60
				},
				{
					...validBreakdown,
					name: "Midterm Exam",
					percentage: 40
				}
			]
		}
	},

	// 6
	{
		description: "6. Rejects breakdown percentages totaling less than 100%",
		expected: false,
		fixture: {
			profesorName: "Ana Rodríguez",
			breakdown: [
				{
					...validBreakdown,
					percentage: 40
				},
				{
					...validBreakdown,
					name: "Midterm Exam",
					percentage: 30
				}
			]
		}
	},

	// 7
	{
		description:
			"7. Rejects combined breakdown and laboratory percentages exceeding 100%",
		expected: false,
		fixture: {
			profesorName: "Carlos Mendoza",
			breakdown: [
				{
					...validBreakdown,
					percentage: 80
				}
			],
			laboratory: {
				profesorName: "Laura Castillo",
				percentage: 30,
				breakdown: [validBreakdown]
			}
		}
	},

	// 8
	{
		description:
			"8. Accepts combined breakdown and laboratory percentages totaling 100%",
		expected: true,
		fixture: {
			profesorName: "Carlos Mendoza",
			breakdown: [
				{
					...validBreakdown,
					percentage: 75
				}
			],
			laboratory: {
				profesorName: "Laura Castillo",
				percentage: 25,
				breakdown: [validBreakdown]
			}
		}
	},

	// 9
	{
		description:
			"9. Rejects combined breakdown and laboratory percentages totaling less than 100%",
		expected: false,
		fixture: {
			profesorName: "Carlos Mendoza",
			breakdown: [
				{
					...validBreakdown,
					percentage: 50
				}
			],
			laboratory: {
				profesorName: "Laura Castillo",
				percentage: 25,
				breakdown: [validBreakdown]
			}
		}
	},

	// 10
	{
		description:
			"10. Rejects a course instance with only a laboratory and no breakdowns",
		expected: false,
		fixture: {
			profesorName: "Roberto Díaz",
			breakdown: [],
			laboratory: {
				profesorName: "Daniel Herrera",
				percentage: 100,
				breakdown: [validBreakdown]
			}
		}
	},

	// 11
	{
		description: "11. Rejects an entry with an empty name",
		expected: false,
		fixture: {
			profesorName: "María González",
			breakdown: [
				{
					...validBreakdown,
					entries: [
						{
							name: "",
							rawScore: 85,
							maxScore: 100
						}
					]
				}
			]
		}
	},

	// 12
	{
		description: "12. Rejects an entry name longer than 30 characters",
		expected: false,
		fixture: {
			profesorName: "María González",
			breakdown: [
				{
					...validBreakdown,
					entries: [
						{
							name: "E".repeat(31),
							rawScore: 85,
							maxScore: 100
						}
					]
				}
			]
		}
	},

	// 13
	{
		description:
			"13. Rejects an entry with a raw score greater than its maximum score",
		expected: false,
		fixture: {
			profesorName: "Sofía Martínez",
			breakdown: [
				{
					...validBreakdown,
					entries: [
						{
							name: "Final Exam",
							rawScore: 110,
							maxScore: 100
						}
					]
				}
			]
		}
	},
	// 14
	{
		description:
			"14. Rejects multiple entries when allowsMultipleEntries is false",
		expected: false,
		fixture: {
			profesorName: "Ana Rodríguez",
			breakdown: [
				{
					...validBreakdown,
					allowsMultipleEntries: false,
					entries: [
						{
							name: "Midterm Exam 1",
							rawScore: 85,
							maxScore: 100
						},
						{
							name: "Midterm Exam 2",
							rawScore: 90,
							maxScore: 100
						}
					]
				}
			]
		}
	}
]

describe.only("Update Course Instance Schema", () => {
	test.each(testCases)("$description", ({ fixture, expected }) => {
		const { success, error } = updateCourseInstanceSchema.safeParse(fixture)
		expect(success).toBe(expected)
	})
})
