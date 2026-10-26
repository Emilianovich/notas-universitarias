import z from "zod"
import { createUserPreferencesSchema } from "./createSettings"

const updateUserPreferences = createUserPreferencesSchema.extend({
	disablePet: z.boolean()
})

export default updateUserPreferences
