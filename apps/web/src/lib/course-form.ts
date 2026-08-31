import type {
	CourseBreakdownToBeCreated,
	CourseInstance
} from "@notas-universitarias/types"
import { useSelector } from "@tanstack/react-form"
import type { EditCourseInstanceFormType } from "@/components/form/courses/hooks/useEditCourseInstanceOpts.ts"

type CourseInstancesPercentages = {
	totalBreakdownPercentage: number
	totalLabDetailBreakdownPercentage: number
}

type CreatingCourseInstanceReturns = CourseInstancesPercentages & {
	breakdownList: CourseBreakdownToBeCreated
}

type EditingCourseInstanceReturns = CourseInstancesPercentages & {
	breakdownList: {
		name: string
		percentage: number
		contribution: number
		entries: {
			rawScore: number
			maxScore: number
			name?: string | undefined
		}[]
		type: "STANDALONE" | "NESTED" | "NOT-NESTED"
		laboratoryDetails?: CourseInstance | undefined
	}[]
}

export default function usePercentagesForEdit(
	form: EditCourseInstanceFormType
): EditingCourseInstanceReturns {
	const breakdownList = useSelector(
		form.store,
		(state) => state.values.breakdown
	)
	const totalBreakdownPercentage = breakdownList.reduce(
		(previousVal, currentVal) => previousVal + currentVal.percentage,
		0
	)
	const laboratoryDetailBreakdown = breakdownList.find(
		(breakdown) => breakdown.type === "NESTED"
	)?.laboratoryDetails?.breakdown
	const totalLabDetailBreakdownPercentage =
		laboratoryDetailBreakdown?.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		) ?? -1
	return {
		breakdownList,
		totalBreakdownPercentage,
		totalLabDetailBreakdownPercentage
	}
}

export function useHandleMissingFormFields(
	form: EditCourseInstanceFormType,
	isForDemo: boolean
) {
	const { breakdownList } = usePercentagesForEdit(form)
	breakdownList.forEach((currBreakdown, _i) => {
		if (currBreakdown.type !== "NESTED" && currBreakdown.laboratoryDetails) {
			currBreakdown.laboratoryDetails = undefined
		}
		if (currBreakdown.laboratoryDetails && isForDemo) {
			currBreakdown.laboratoryDetails.profesorName = "Sam"
			currBreakdown.laboratoryDetails.finalGrade = 0
		}
	})
}

// export function usePercentagesForCreation(
// 	form: EditCourseInstanceFormType
// ): CreatingCourseInstanceReturns
