
import type { Db } from "mongodb"
import type { MigrationObject } from "../index.js"

export const migration: MigrationObject = {
    name: "005-update-user-preferences-schema",

    up: async (db: Db, _mongoService) => {
        await db.command({
            collMod: "users",
            validationLevel: "strict",
            validationAction: "error",
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: "Users Validations",
                    required: ["name", "email", "password", "preferences"],
                    properties: {
                        name: {
                            bsonType: "string",
                            minLength: 1,
                            maxLength: 100,
                            description:
                                "A user name is required and should have between 1 and 100 characters"
                        },
                        email: {
                            bsonType: "string",
                            pattern:
                                "^(?!.*\\.\\.)(?!\\.)(?!.*\\.$)[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\\.)+[A-Za-z]{2,}$",
                            description: "Email has to be of valid format"
                        },
                        password: {
                            bsonType: "string",
                            description: "User password is required"
                        },
                        preferences: {
                            bsonType: "object",
                            description: "User preferences are required",
                            required: [
                                "fontFamily",
                                "theme",
                                "petName",
                                "disablePet"
                            ],
                            properties: {
                                fontFamily: {
                                    bsonType: "string",
                                    enum: [
                                        "Arima",
                                        "Amiko",
                                        "Playwrite VN",
                                        "Elsie",
                                        "Libertinus Math",
                                        "Nunito",
                                        "Gorditas",
                                        "Special Elite",
                                        "Short Stack",
                                        "Uncial Antiqua",
                                        "Saira Stencil",
                                        "Cherry Cream Soda",
                                        "Audiowide",
                                        "Cabin Sketch",
                                        "Chalkboard SE",
                                        "Fredoka",
                                        "Erzieherisch"
                                    ],
                                    description:
                                        "A valid font family is required"
                                },
                                theme: {
                                    bsonType: "string",
                                    enum: [
                                        "dark",
                                        "light",
                                        "high-contrast",
                                        "sepia"
                                    ],
                                    description:
                                        "A valid theme is required ('dark', 'light', 'high-contrast', 'sepia')"
                                },
                                petName: {
                                    bsonType: "string",
                                    enum: ["Spike", "Leon", "Tom", "Nita", "Mila"],
                                    description:
                                        "A valid pet name is required ('Spike', 'Leon', 'Tom', 'Nita', 'Mila')"
                                },
                                disablePet: {
                                    bsonType: "bool",
                                    description: "A boolean is required"
                                }
                            }
                        }
                    }
                }
            }
        })

        await db.collection("users").updateMany(
            {
                "preferences.disablePet": { $exists: false }
            },
            {
                $set: {
                    "preferences.disablePet": false
                }
            }
        )
    }
}
