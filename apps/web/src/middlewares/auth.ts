import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

const authMiddleware = createMiddleware().server(({ next, request }) => {
	const cookieHeaders= request.headers.get("cookie")
	if (!cookieHeaders) {
		throw redirect({
			to: "/login",
			search: {
				wasRedirected: "true"
			}
		})
	}
	const individualCookies = cookieHeaders.split(";")
	const sessionCookie = individualCookies.find((cookie) =>
		cookie.includes("user_session")
	)
	console.log("sessionCookie", sessionCookie)
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
