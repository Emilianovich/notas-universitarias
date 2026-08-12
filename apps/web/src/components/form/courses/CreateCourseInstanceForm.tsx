import {
	type CourseBreakdownToBeCreated,
	type CourseInstanceToBeCreated,
	CreateCourseInstanceSchema
} from "@notas-universitarias/types"
import {useForm, useSelector} from "@tanstack/react-form"
import RadioInput from "@/components/form/general/RadioInput.tsx"
import useToast from "@/contexts/toast.ts"

// const registerCourseInstance = async () => {
//
// }


export default function CreateCourseInstanceForm() {
	const { buildToast } = useToast()
	const form = useForm({
		validators: {
			onBlur: CreateCourseInstanceSchema
		},
		defaultValues: {
			isRegistered: false,
			name: undefined,
			previousCourseId: undefined,
			profesorName: "",
			breakdown: [] as CourseBreakdownToBeCreated[]
		} as CourseInstanceToBeCreated,
		onSubmitInvalid: () => {
			buildToast({
				id: Date.now(),
				type: "error",
				content: `Asegúrate llenar todos los campos y cumplir con todas las validaciones`
			})
		},
		onSubmit: async ({ value }) => {
			console.log(value)
		}
	})
	const { Field } = form
	const isRegistered = useSelector(form.store, (state) => state.values.isRegistered)
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				e.stopPropagation()
				await form.handleSubmit()
			}}
		>
			<Field
				name={"isRegistered"}
				children={(fieldApi) => {
					const { name, handleBlur, handleChange } = fieldApi
					return (
						<div>
							<RadioInput
								radioGroupName={name}
								value={"1"}
								radioId={"hasNotBeenRegistered"}
								labelText={"Sí"}
								syncValueToState={(e) =>
									handleChange(Boolean(Number(e.target.value)))
								}
								handleBlur={handleBlur}
							/>
							<RadioInput
								radioGroupName={name}
								value={"0"}
								radioId={"hasBeenRegistered"}
								labelText={"No"}
								syncValueToState={(e) =>
									handleChange(Boolean(Number(e.target.value)))
								}
								handleBlur={handleBlur}
							/>
						</div>
					)
				}}
			/>
			{/*{ !isRegistered && (*/}
			{/*	<Field name={""}*/}
			{/*) }*/}
		</form>
	)
}
//
