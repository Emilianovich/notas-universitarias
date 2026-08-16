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
}

export type NavToOutsideProps = {
  text: string
  href: string
}

export function Nav({ children }: HeaderAndNavProps) {
	return (
		<nav style={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)" }}>
			{children}
		</nav>
	)
}

export function NavOption({ navigateTo, text }: NavOptions) {
	return (
		<Link
			to={navigateTo}
			className="text-[20px] text-center  w-fit"
			activeProps={{ className: "text-primary-300 underline" }}
			inactiveProps={{
				className:
					"text-primary-600 hover:scale-[0.95] transition-all duration-200 ease-in-out"
			}}
		>
			{text}
		</Link>
	)
}

export function NavToOutside({ text, href }: NavToOutsideProps) {
  return (
    <Link
      to={href}
      target={"_blank"}
      className="text-[20px] w-25 text-primary-600 hover:scale-[0.95] transition-all duration-200 ease-in-out"
    >
      {text}
    </Link>
  )
}
