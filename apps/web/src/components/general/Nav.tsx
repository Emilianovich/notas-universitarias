import { Link } from "@tanstack/react-router"
import type * as React from "react"

export type NavOptions = {
	navigateTo:
		| "/"
		| "/demo"
		| "/register"
		| "/login"
		| "/home"
		| "/home/current-period"
		| "/home/history"
		| "/home/register-period"
		| "/home/settings"
	text: string
}

export type HeaderAndNavProps = {
	children: React.ReactNode
	fontFamily?: string
}

export type NavToOutsideProps = {
	text: string
	href: string
}

export function Nav({ children, fontFamily }: HeaderAndNavProps) {
	return (
		<nav style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", fontFamily }}>
			{children}
		</nav>
	)
}

export function NavOption({ navigateTo, text }: NavOptions) {
	return (
		<div
			className={
				"w-[clamp(80px,80px,fit-content)] flex items-center justify-center"
			}
		>
			<Link
				to={navigateTo}
				className="text-center  w-fit sm:text-sm lg:text-xl"
				activeProps={{ className: "text-primary-300 underline" }}
				inactiveProps={{
					className:
						"text-primary-600 hover:scale-[0.95] transition-all duration-200 ease-in-out"
				}}
			>
				{text}
			</Link>
		</div>
	)
}

export function NavToOutside({ text, href }: NavToOutsideProps) {
	return (
		<div
			className={
				"w-[clamp(80px,80px,fit-content)] flex items-center justify-center"
			}
		>
			<Link
				to={href}
				target={"_blank"}
				className="text-center  w-fit sm:text-sm lg:text-xl  text-primary-600 hover:scale-[0.95] transition-all duration-200 ease-in-out"
			>
				{text}
			</Link>
		</div>
	)
}
