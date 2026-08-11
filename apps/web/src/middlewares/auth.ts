import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

const authMiddleware = createMiddleware().server(({ next }) => {
	// TODO fix that no cookie is present when refreshing a page
	const cookies = getRequestHeader("cookie")
	if (!cookies) {
		throw redirect({
			to: "/login",
			search: {
				wasRedirected: "true"
			}
		})
	}
	const individualCookies = cookies.split(";")
	const sessionCookie = individualCookies.find((cookie) =>
		cookie.includes("user_session")
	)
	if (!sessionCookie) {
		throw redirect({
			to: "/login",
			search: {
				wasRedirected: "true"
			}
		})
	}
	return next()
})

export default authMiddleware
