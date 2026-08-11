import type { AddItemProps } from "@/routes/home/current-period/-CourseInstancesContainer.tsx"

export function AddItem({ title, action }: AddItemProps) {
	return (
		<div className={"flex flex-col gap-4 justify-center items-center"}>
			<p className={"text-xl"}>{title}</p>
			<img
				src={"/add.svg"}
				alt={`Botón para ${title}`}
				title={title}
				className={
					"w-10 h-10 hover:scale-110 cursor-pointer transition-all duration-300 ease-in-out"
				}
				onClick={action}
			/>
		</div>
	)
}
