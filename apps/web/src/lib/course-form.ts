import { useSelector } from "@tanstack/react-form"
import type {
	CreateCourseInstanceFormType,
	EditCourseInstanceFormType,
} from "@/components/form/courses/types/types.ts"

export default function usePercentagesForEdit(
	form: EditCourseInstanceFormType
) {
	const breakdownList = useSelector(
		form.store,
		(state) => state.values.breakdowns
	)
	const breakdownsPercentage = breakdownList.reduce(
		(previousVal, currentVal) => previousVal + currentVal.percentage,
		0
	)
	const laboratory = useSelector(form.store, (state) => state.values.laboratory)
	let laboratoryPercentage = 0
	if (laboratory) {
		laboratoryPercentage = laboratory.breakdowns.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		)
	}
	const totalPercentage = breakdownsPercentage + laboratoryPercentage
	return {
		breakdownList,
		totalPercentage
	}
}

// export function useHandleMissingFormFields(
// 	form: EditCourseInstanceFormType,
// 	isForDemo: boolean
// ) {
// 	const { breakdownList } = usePercentagesForEdit(form)
// 	breakdownList.forEach((currBreakdown, _i) => {
// 		if (currBreakdown.type !== "NESTED" && currBreakdown.laboratoryDetails) {
// 			currBreakdown.laboratoryDetails = undefined
// 		}
// 		if (currBreakdown.laboratoryDetails && isForDemo) {
// 			currBreakdown.laboratoryDetails.profesorName = "Sam"
// 			currBreakdown.laboratoryDetails.finalGrade = 0
// 		}
// 	})
// }

export function useFormDataForCreation(
	form: CreateCourseInstanceFormType
) {
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
		(state) => state.values.breakdowns
	)
	const breakdownsPercentage = breakdownArray.reduce(
		(previousVal, currentVal) => previousVal + currentVal.percentage,
		0
	)
	const laboratory = useSelector(form.store, (state) => state.values.laboratory)
	let laboratoryPercentage = 0
	let laboratoryTotalPercentage : number = 0
	if (laboratory) {
		laboratoryPercentage = laboratory.percentage
		laboratoryTotalPercentage = laboratory.breakdowns.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		)
	}
	const totalPercentage = breakdownsPercentage + laboratoryPercentage
	return {
		isRegistered,
		breakdownList: breakdownArray,
		totalBreakdownPercentage: totalPercentage,
		laboratory,
		submissionAttempts,
		laboratoryTotalPercentage
	}
}
