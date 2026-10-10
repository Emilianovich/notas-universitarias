import { describe, expect, test } from "vitest"
import {CreateCourseInstanceSchema} from "./createCourseInstances";

const validBreakdown = {
    name: "Examen final",
    percentage: 100,
    allowsMultipleEntries: false,
}

const baseCourseInstance = {
    isRegistered: false,
    name: "Programación I",
    profesorName: "Ana Rodríguez",
    breakdown: [validBreakdown],
}

const testCases = [
    {
        description: "1. Accepts name when isRegistered is false",
        fixture: {
            ...baseCourseInstance,
        },
        expected: true,
    },
    {
        description: "2. Rejects name when isRegistered is true",
        fixture: {
            ...baseCourseInstance,
            isRegistered: true,
            previousCourseId: "course-001",
        },
        expected: false,
    },
    {
        description: "3. Rejects previousCourseId when isRegistered is false",
        fixture: {
            ...baseCourseInstance,
            name: undefined,
            previousCourseId: "course-002",
        },
        expected: false,
    },
    {
        description: "4. Accepts previousCourseId when isRegistered is true",
        fixture: {
            ...baseCourseInstance,
            name: undefined,
            isRegistered: true,
            previousCourseId: "course-003",
        },
        expected: true,
    },
    {
        description: "5. Rejects name with 101 chars",
        fixture: {
            ...baseCourseInstance,
            name: "A".repeat(101),
        },
        expected: false,
    },
    {
        description: "6. Accepts name with exactamente 100 chars",
        fixture: {
            ...baseCourseInstance,
            name: "A".repeat(100),
        },
        expected: true,
    },
    {
        description: "7. Rejects profesorName with 101 chars",
        fixture: {
            ...baseCourseInstance,
            profesorName: "P".repeat(101),
        },
        expected: false,
    },
    {
        description: "8. Rejects a percentage that surpasses 100%",
        fixture: {
            ...baseCourseInstance,
            breakdown: [
                {
                    ...validBreakdown,
                    percentage: 120,
                },
            ],
        },
        expected: false,
    },
    {
        description: "9. Accepts breakdown + laboratory that add up to 100%",
        fixture: {
            ...baseCourseInstance,
            breakdown: [
                {
                    ...validBreakdown,
                    percentage: 75,
                },
            ],
            laboratory: {
                profesorName: "Laura Castillo",
                percentage: 25,
                breakdown: [validBreakdown],
            },
        },
        expected: true,
    },
    {
        description: "10. Rejects breakdown + laboratory that surpass 100%",
        fixture: {
            ...baseCourseInstance,
            breakdown: [
                {
                    ...validBreakdown,
                    percentage: 80,
                },
            ],
            laboratory: {
                profesorName: "Laura Castillo",
                percentage: 30,
                breakdown: [validBreakdown],
            },
        },
        expected: false,
    },
]
describe("Create Course Instance Schema", () => {
    test.each(testCases)("$description", ({ fixture, expected }) => {
        const { success } = CreateCourseInstanceSchema.safeParse(fixture)
        expect(success).toBe(expected)
    })
})