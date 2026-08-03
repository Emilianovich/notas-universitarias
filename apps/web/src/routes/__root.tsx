import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type { ReactNode } from "react"
import SettingsProvider from "@/components/context-providers/settings-provider.tsx"
import appCss from "../styles.css?url"

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
				title: "TanStack Start Starter"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss
			}
		]
	}),
	shellComponent: RootDocument
})

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<SettingsProvider>{children}</SettingsProvider>
			</body>
			<TanStackDevtools
				config={{
					position: "bottom-right"
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />
					}
				]}
			/>
			<Scripts />
		</html>
	)
}
