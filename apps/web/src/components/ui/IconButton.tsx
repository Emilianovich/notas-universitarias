export type IconButtonProps = {
	className: string
	action: () => Promise<void> | void
	img: {
		src: string
		alt: string
	}
}

export default function IconButton({
	className,
	action,
	img
}: IconButtonProps) {
	const { src, alt } = img
	return (
		<button
			className={`bg-none border-none p-0 inline-flex justify-center items-center cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out`}
			onClick={action}
			title={alt}
			type={"button"}
		>
			<img
				src={src}
				alt={alt}
				className={className}
				style={{ objectFit: "contain" }}
			/>
		</button>
	)
}
