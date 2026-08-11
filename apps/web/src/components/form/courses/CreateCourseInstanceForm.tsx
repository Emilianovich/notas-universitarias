// import {useForm} from "@tanstack/react-form";
// import {CreateCourseInstanceSchema} from "@notas-universitarias/types";
// import useToast from "@/contexts/toast.ts";
//
// // const registerCourseInstance = async () => {
// //
// // }
//
// export default function CreateCourseInstanceForm() {
//     const { buildToast } = useToast()
//     const form = useForm({
//         validators: {
//             onBlur: CreateCourseInstanceSchema
//         },
//         defaultValues: {
//           isRegistered: false,
//           name: "",
//           profesorName: "",
//           breakdown: [] as Brea
//
//         },
//         onSubmitInvalid: () => {
//             buildToast({
//                 id: Date.now(),
//                 type: "error",
//                 content: `Asegúrate llenar todos los campos y cumplir con todas las validaciones`
//             })
//         },
//         onSubmit: async ({ value }) => {
//             console.log(value)
//         }
//     })
//     const { Field } = form
//     return (
//         <form onSubmit={async (e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             await form.handleSubmit()
//         }}>
//             <Field
//                 name={"isRegistered"}
//                 mode={"array"}
//                 children={(fieldApi) => (
//
//                 )}
//             />
//         </form>
//     )
// }
