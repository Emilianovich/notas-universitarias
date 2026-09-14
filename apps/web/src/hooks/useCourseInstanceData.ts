import { buildRequest } from "@notas-universitarias/helpers"
import type { CourseInstanceData } from "@notas-universitarias/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import { baseUrl } from "@/routes/__root.tsx"

export const getCourseInstance = async (id: string) => {
	return buildRequest<CourseInstanceData, string>({
		baseUrl,
		method: "GET",
		path: `/course-instances/${id}`,
		includeCredentials: true
	})
}
export default function useCourseInstanceData(id: string) {
	const { data, error } = useSuspenseQuery({
		queryKey: ["getCourseInstanceForEdit", id],
		queryFn: () => getCourseInstance(id)
	})
	const { courseInstance, courseName } = data.content
	return {
		courseInstance,
		courseName,
		error,
		courseInstanceGrade: courseInstance.finalGrade,
		profesorName: courseInstance.profesorName
	}
}
