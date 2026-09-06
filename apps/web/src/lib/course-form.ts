import { useSelector } from "@tanstack/react-form"
import type {
	CreateCourseInstanceFormType, CreatingCourseInstanceReturns,
	EditCourseInstanceFormType,
	EditingCourseInstanceReturns
} from "@/components/form/courses/types/types.ts";



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

export function useFormDataForCreation(
	form: CreateCourseInstanceFormType
): CreatingCourseInstanceReturns {
	const isRegistered = useSelector(
		form.store,
		(state) => state.values.isRegistered
	)
	const submissionAttempts = useSelector(
		form.store,
		(state) => state.submissionAttempts
	)
	const breakdownArray = useSelector(
		form.store,
		(state) => state.values.breakdown
	)
	const totalPercentage = breakdownArray.reduce(
		(previousVal, currentVal) => previousVal + currentVal.percentage,
		0
	)
	const laboratoryDetailBreakdownArray = breakdownArray.find(
		(breakdown) => breakdown.type === "NESTED"
	)?.laboratoryDetails?.breakdown
	const labDetailTotalPercentage =
		laboratoryDetailBreakdownArray?.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		) ?? -1
	breakdownArray.forEach((breakdown) => {
		if (breakdown.type !== "NESTED" && breakdown.laboratoryDetails) {
			breakdown.laboratoryDetails = undefined
		}
	})
	return {
		isRegistered,
		breakdownList: breakdownArray,
		totalBreakdownPercentage: totalPercentage,
		totalLabDetailBreakdownPercentage: labDetailTotalPercentage,
		submissionAttempts,
	}
}
