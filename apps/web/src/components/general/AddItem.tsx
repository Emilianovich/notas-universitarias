import type { AddItemProps } from "@/routes/home/current-period/-CourseInstancesContainer.tsx"

export function AddItem({ title, action }: AddItemProps) {
	return (
		<div className={"flex flex-col gap-4 justify-center items-center"}>
			<p className={"sm:text-base lg:text-xl"}>{title}</p>
			<img
				src={"/add.svg"}
				alt={`Botón para ${title}`}
				title={title}
				className={
					"sm:size-5 lg:size-7 hover:scale-110 cursor-pointer transition-all duration-300 ease-in-out"
				}
				onClick={action}
			/>
		</div>
	)
}
