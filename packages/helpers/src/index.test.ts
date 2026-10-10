import {describe, expect, test} from 'vitest'
import {
    computeBreakdownContribution, copyObject,
    getValueOver100, RCourse,
    RCourseInstance, roundNumber, RupdateCourseAverageGrade,
    RupdateCourseInstanceFinalGrade
} from "./index";
import {CourseBreakdownEntry} from "@notas-universitarias/types";

const courseInstances: RCourseInstance[] = [
    {
        profesorName: "Ana Rodríguez",
        finalGrade: 0.8730,
        breakdowns: [
            {
                name: "Parciales",
                percentage: 0.30,
                contribution: 0.2620,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Parcial 1", rawScore: 82, maxScore: 100 },
                    { name: "Parcial 2", rawScore: 45, maxScore: 50 },
                    { name: "Parcial 3", rawScore: 18, maxScore: 20 },
                ],
            },
            {
                name: "Quices",
                percentage: 0.20,
                contribution: 0.1750,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Quiz 1", rawScore: 9, maxScore: 10 },
                    { rawScore: 17, maxScore: 20 },
                ],
            },
            {
                name: "Proyecto",
                percentage: 0.20,
                contribution: 0.1840,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 46, maxScore: 50 }],
            },
            {
                name: "Examen final",
                percentage: 0.30,
                contribution: 0.2520,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 84, maxScore: 100 }],
            },
        ],
    },

    {
        profesorName: "Carlos Mendoza",
        finalGrade: 0.9124,
        breakdowns: [
            {
                name: "Parciales",
                percentage: 0.25,
                contribution: 0.2275,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Parcial 1", rawScore: 27, maxScore: 30 },
                    { name: "Parcial 2", rawScore: 46, maxScore: 50 },
                ],
            },
            {
                name: "Tareas",
                percentage: 0.10,
                contribution: 0.0944,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Tarea 1", rawScore: 10, maxScore: 10 },
                    { name: "Tarea 2", rawScore: 18, maxScore: 20 },
                    { name: "Tarea 3", rawScore: 14, maxScore: 15 },
                ],
            },
            {
                name: "Proyecto",
                percentage: 0.15,
                contribution: 0.1410,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 47, maxScore: 50 }],
            },
            {
                name: "Examen final",
                percentage: 0.25,
                contribution: 0.2275,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 91, maxScore: 100 }],
            },
        ],

        laboratory: {
            profesorName: "Laura Castillo",
            percentage: 0.25,
            finalGrade: 0.8880,
            breakdowns: [
                {
                    name: "Prácticas",
                    percentage: 0.60,
                    contribution: 0.5360,
                    allowsMultipleEntries: true,
                    entries: [
                        { name: "Práctica 1", rawScore: 18, maxScore: 20 },
                        { name: "Práctica 2", rawScore: 42, maxScore: 50 },
                        { name: "Práctica 3", rawScore: 28, maxScore: 30 },
                        { name: "Práctica 4", rawScore: 9, maxScore: 10 },
                    ],
                },
                {
                    name: "Examen de laboratorio",
                    percentage: 0.40,
                    contribution: 0.3520,
                    allowsMultipleEntries: false,
                    entries: [{ rawScore: 44, maxScore: 50 }],
                },
            ],
        },
    },

    {
        profesorName: "María González",
        finalGrade: 0.7751,
        breakdowns: [
            {
                name: "Tareas",
                percentage: 0.25,
                contribution: 0.2006,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Tarea 1", rawScore: 18, maxScore: 25 },
                    { name: "Tarea 2", rawScore: 42, maxScore: 50 },
                    { rawScore: 8, maxScore: 10 },
                    { rawScore: 17, maxScore: 20 },
                ],
            },
            {
                name: "Parciales",
                percentage: 0.45,
                contribution: 0.3375,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Parcial 1", rawScore: 68, maxScore: 100 },
                    { name: "Parcial 2", rawScore: 41, maxScore: 50 },
                ],
            },
            {
                name: "Examen final",
                percentage: 0.30,
                contribution: 0.2370,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 79, maxScore: 100 }],
            },
        ],
    },

    {
        profesorName: "Roberto Díaz",
        finalGrade: 0.9581,
        breakdowns: [
            {
                name: "Parciales",
                percentage: 0.30,
                contribution: 0.2843,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Parcial 1", rawScore: 48, maxScore: 50 },
                    { name: "Parcial 2", rawScore: 28, maxScore: 30 },
                    { name: "Parcial 3", rawScore: 19, maxScore: 20 },
                ],
            },
            {
                name: "Quices",
                percentage: 0.10,
                contribution: 0.0950,
                allowsMultipleEntries: true,
                entries: [
                    { rawScore: 9, maxScore: 10 },
                    { rawScore: 10, maxScore: 10 },
                    { rawScore: 18, maxScore: 20 },
                    { rawScore: 20, maxScore: 20 },
                ],
            },
            {
                name: "Proyecto final",
                percentage: 0.15,
                contribution: 0.1470,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 49, maxScore: 50 }],
            },
            {
                name: "Examen final",
                percentage: 0.25,
                contribution: 0.2400,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 96, maxScore: 100 }],
            },
        ],

        laboratory: {
            profesorName: "Daniel Herrera",
            percentage: 0.20,
            finalGrade: 0.9574,
            breakdowns: [
                {
                    name: "Prácticas",
                    percentage: 0.70,
                    contribution: 0.6634,
                    allowsMultipleEntries: true,
                    entries: [
                        { name: "Práctica 1", rawScore: 19, maxScore: 20 },
                        { name: "Práctica 2", rawScore: 48, maxScore: 50 },
                        { name: "Práctica 3", rawScore: 28, maxScore: 30 },
                    ],
                },
                {
                    name: "Proyecto de laboratorio",
                    percentage: 0.30,
                    contribution: 0.2940,
                    allowsMultipleEntries: false,
                    entries: [{ rawScore: 49, maxScore: 50 }],
                },
            ],
        },
    },

    {
        profesorName: "Sofía Martínez",
        finalGrade: 0.8200,
        breakdowns: [
            {
                name: "Participación",
                percentage: 0.10,
                contribution: 0.0900,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 18, maxScore: 20 }],
            },
            {
                name: "Quices",
                percentage: 0.20,
                contribution: 0.1400,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Quiz 1", rawScore: 7, maxScore: 10 },
                ],
            },
            {
                name: "Parciales",
                percentage: 0.40,
                contribution: 0.3320,
                allowsMultipleEntries: true,
                entries: [
                    { name: "Parcial 1", rawScore: 39, maxScore: 50 },
                    { name: "Parcial 2", rawScore: 88, maxScore: 100 },
                ],
            },
            {
                name: "Examen final",
                percentage: 0.30,
                contribution: 0.2580,
                allowsMultipleEntries: false,
                entries: [{ rawScore: 86, maxScore: 100 }],
            },
        ],
    },
]
const course: RCourse = {
    name: "Programación",
    averageGrade: 0.8677,
    courseInstances,
}
const breakdown = copyObject(courseInstances[0].breakdowns[0])
const courseInstanceWithLaboratory = courseInstances.find(instance => instance.laboratory)
const courseInstanceWithoutLaboratory = courseInstances.find(instance => !instance.laboratory)
describe("Round Number Function", () => {
    test("Exception Thrown", () => {
        expect(() => roundNumber({number: 86.556, amountOfDecimals: 1.2})).toThrow(RangeError)
    })
    test("Rounded Correctly", () => {
        expect(roundNumber({number: 86.556, amountOfDecimals: 2})).toEqual(86.56)
    })
})

describe("Computing Course Instance Final Grade", () => {
    describe("getValueOver100 function", () => {
        test("Compute Grade for entry which max score is not 100", () => {
            const entry : CourseBreakdownEntry = {
                rawScore: 80,
                maxScore: 96,
            }
            const val = getValueOver100(entry)
            expect(val).toEqual((8/9.6) * 100)
        })
        test("Compute Grade for entry which max score is equal to 100", () => {
            const entry : CourseBreakdownEntry = {
                rawScore: 60,
                maxScore: 100,
            }
            const val = getValueOver100(entry)
            expect(val).toEqual((6/10) * 100)
        })
    })
    describe("computeBreakdownContribution function", () => {
        test("Compute Breakdown contribution", () => {
            const {contribution} = breakdown
            computeBreakdownContribution(breakdown)
            const {contribution : computedContribution} = breakdown
            expect(roundNumber({ number: computedContribution, amountOfDecimals: 2 })).toBeCloseTo(contribution)
        })
    })
    describe("updateCourseInstanceFinalGrade function", () => {
        test("Course Instance With Laboratory", () => {
            if (!courseInstanceWithLaboratory) return
            const copyOfCourseInstanceWithLaboratory = copyObject(courseInstanceWithLaboratory)
            const { finalGrade }  = copyOfCourseInstanceWithLaboratory
            RupdateCourseInstanceFinalGrade(copyOfCourseInstanceWithLaboratory)
            const { finalGrade : computedFinalGrade }  = copyOfCourseInstanceWithLaboratory
            expect(roundNumber({number: computedFinalGrade, amountOfDecimals: 2})).toBeCloseTo(finalGrade)
        })
        test("Course Instance Without Laboratory", () => {
            if (!courseInstanceWithoutLaboratory) return
            const copyOfCourseInstanceWithoutLaboratory = copyObject(courseInstanceWithoutLaboratory)
            const { finalGrade }  = copyOfCourseInstanceWithoutLaboratory
            RupdateCourseInstanceFinalGrade(copyOfCourseInstanceWithoutLaboratory)
            const { finalGrade : computedFinalGrade }  = copyOfCourseInstanceWithoutLaboratory
            expect(roundNumber({number: computedFinalGrade, amountOfDecimals: 2})).toBeCloseTo(finalGrade)
        })
        test("Compute finalGrade for courseInstances", () => {
            const { courseInstances } = course
            courseInstances.forEach(instance => {
                const { finalGrade }  = instance
                RupdateCourseInstanceFinalGrade(instance)
                const { finalGrade : computedFinalGrade }  = instance
                expect(computedFinalGrade).toBeCloseTo(finalGrade)
            })
        })
    })
})

describe("updateCourseAverageGrade function", () => {
    test("Compute Course Average Grade", () => {
        const {averageGrade} = course
        RupdateCourseAverageGrade(course)
        const {averageGrade: computedAverageGrade} = course
        expect(roundNumber({ number: computedAverageGrade, amountOfDecimals: 2 })).toBeCloseTo(averageGrade)
    })
})
