import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import appCss from "../styles.css?url"

export const queryClient = new QueryClient()
export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "Notas universitarias"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss
			},
			{
				rel: "icon",
				href: "/logo-favicon.ico"
			}
		]
	}),
	shellComponent: RootDocument
})

function RootDocument() {
	return (
		<html lang="es">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<HeadContent />
			</head>
			<QueryClientProvider client={queryClient}>
				<Outlet />
			</QueryClientProvider>
			<Scripts />
		</html>
	)
}
