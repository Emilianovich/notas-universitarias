import { serve } from "@hono/node-server"
import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
	return c.text("¡Tengo que hacer un backend!")
})

serve(
	{
		fetch: app.fetch,
		port: 3035
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`)
	}
)
