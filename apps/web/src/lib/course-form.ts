import { useSelector } from "@tanstack/react-form"
import type {
	CreateCourseInstanceFormType,
	EditCourseInstanceFormType
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
	let laboratoryBreakdownPercentage = 0
	let laboratoryPercentage = 0
	if (laboratory) {
		laboratoryPercentage = laboratory.percentage
		laboratoryBreakdownPercentage = laboratory.breakdowns.reduce(
			(previousVal, currentVal) => previousVal + currentVal.percentage,
			0
		)
	}
	const totalPercentage = breakdownsPercentage + laboratoryPercentage
	return {
		breakdownList,
		totalPercentage,
		laboratoryPercentage: laboratoryBreakdownPercentage,
		breakdownsPercentage,
	}
}

export function useFormDataForCreation(form: CreateCourseInstanceFormType) {
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
	let laboratoryTotalPercentage: number = 0
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
		breakdownsPercentage,
		laboratory,
		submissionAttempts,
		laboratoryTotalPercentage
	}
}
