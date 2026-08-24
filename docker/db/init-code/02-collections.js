db = db.getSiblingDB("app")

db.createCollection("users", {
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
					required: ["fontFamily", "theme", "petName"],
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
								"Metamorphous",
								"Audiowide",
								"Cabin Sketch"
							],
							description: "A valid font family is required"
						},
						theme: {
							bsonType: "string",
							enum: ["dark", "light"],
							description: "A valid theme is required ('dark', 'light')"
						},
						petName: {
							bsonType: "string",
							enum: ["Spike", "Leon", "Tom", "Nita", "Mila"],
							description:
								"A valid pet name is required ('Spike', 'Leon', 'Tom', 'Nita', 'Mila')"
						}
					}
				}
			}
		}
	}
})

db.createCollection("courses", {
	validationLevel: "strict",
	validationAction: "error",
	validator: {
		$jsonSchema: {
			bsonType: "object",
			title: "Course Validations",
			required: ["name", "averageGrade", "courseInstances", "userId"],
			properties: {
				name: {
					bsonType: "string",
					description: "A course name must be a string and its required"
				},
				averageGrade: {
					bsonType: "number",
					minimum: 0,
					maximum: 100,
					description:
						"A course average grade must be minimum 0 and maximum 100"
				},
				courseInstances: {
					bsonType: "array",
					items: { bsonType: "objectId" },
					minItems: 1
				},
				userId: {
					bsonType: "objectId",
					description: "An user id is required for each academic period"
				}
			}
		}
	}
})

db.createCollection("sessions", {
	validationLevel: "strict",
	validationAction: "error",
	validator: {
		$and: [
			{
				$jsonSchema: {
					bsonType: "object",
					title: "User Session Validations",
					required: ["issuedAt", "expiresAt", "userId", "hash"],
					properties: {
						issuedAt: {
							bsonType: "date",
							description: `The session issuedAt is required`
						},
						expiresAt: {
							bsonType: "date",
							description: `The session expiresAt is required`
						},
						userId: {
							bsonType: "objectId",
							description: "An user id is required for each session"
						},
						hash: {
							bsonType: "string",
							description: "A hash is required for each session"
						}
					}
				}
			},
			{ $expr: { $gt: ["$expiresAt", "$issuedAt"] } }
		]
	}
})

db.createCollection("academicPeriods", {
	validationLevel: "strict",
	validationAction: "error",
	validator: {
		$and: [
			{
				$jsonSchema: {
					bsonType: "object",
					title: "Academic Period Validations",
					required: ["name", "startDate", "endDate", "isActive", "userId"],
					properties: {
						name: {
							bsonType: "string",
							description:
								"The academic period name must be a string and its required"
						},
						startDate: {
							bsonType: "date",
							description: `The academic period start date is required`
						},
						endDate: {
							bsonType: "date",
							description: `The academic period end date is required`
						},
						courseInstances: {
							bsonType: ["null", "array"],
							items: { bsonType: "object" }
						},
						registeredCourses: {
							bsonType: ["null", "array"],
							items: { bsonType: "objectId" }
						},
						isActive: {
							bsonType: "bool",
							description:
								"The academic period must be a boolean and is required"
						},
						userId: {
							bsonType: "objectId",
							description: "An user id is required for each academic period"
						}
					}
				}
			},
			{ $expr: { $gt: ["$endDate", "$startDate"] } }
		]
	}
})

db.createCollection("courseInstances", {
	validator: {
		$and: [
			{
				$jsonSchema: {
					bsonType: "object",
					title: "Course Instances Validations",
					required: ["profesorName", "finalGrade", "breakdown"],
					properties: {
						profesorName: {
							bsonType: "string",
							description: "A profesor name is required for a course instance"
						},
						finalGrade: {
							bsonType: "number",
							minimum: 0,
							maximum: 1,
							description: "A Grade is required for a course instance"
						},
						breakdown: {
							bsonType: "array",
							minItems: 1,
							description: "Course instance must have at least one breakdown",
							items: {
								bsonType: "object",
								required: [
									"contribution",
									"name",
									"entries",
									"percentage",
									"type"
								],
								properties: {
									contribution: {
										bsonType: "number",
										minimum: 0,
										description: "Breakdown contribution cannot be negative"
									},
									name: {
										bsonType: "string",
										description:
											"Breakdown name must be a string and its required"
									},
									entries: {
										bsonType: "array",
										items: {
											bsonType: "object",
											required: ["rawScore", "maxScore"],
											properties: {
												name: {
													bsonType: ["null", "string"]
												},
												rawScore: {
													bsonType: "number",
													description:
														"Course Breakdown Entry raw score is number and required"
												},
												maxScore: {
													bsonType: "int",
													description:
														"Course Breakdown Entry max score is an int and required"
												}
											}
										}
									},
									percentage: {
										bsonType: "number",
										minimum: 0,
										maximum: 1,
										description:
											"Course Breakdown Entry percentage is number, required and must be between 0 and 1"
									},
									type: {
										enum: ["STANDALONE", "NESTED", "NOT-NESTED"],
										description:
											"Course Breakdown type is either STANDALONE, NESTED or NOT-NESTED"
									},
									laboratoryDetails: {
										bsonType: ["object", "null"]
									}
								}
							}
						}
					}
				}
			},
			{
				$expr: {
					$allElementsTrue: {
						$map: {
							input: "$breakdown",
							as: "item",
							in: {
								$and: [
									{ $lte: ["$$item.contribution", "$$item.percentage"] },
									{
										$allElementsTrue: {
											$map: {
												input: "$$item.entries",
												as: "entry",
												in: {
													$lte: ["$$entry.rawScore", "$$entry.maxScore"]
												}
											}
										}
									}
								]
							}
						}
					}
				}
			}
		]
	}
})
db.createCollection("migrations", {
	validationLevel: "strict",
	validationAction: "error",
	validator: {
		$jsonSchema: {
			bsonType: "object",
			title: "Migrations Validations",
			required: ["name", "ranAt"],
			properties: {
				name: {
					bsonType: "string",
					minLength: 1,
					description: "Migration name is required"
				},
				ranAt: {
					bsonType: "date",
					description: "Date when the migration was executed"
				}
			}
		}
	}
})

db.migrations.createIndex(
	{ name: 1 },
	{
		name: "unique_migration_name",
		unique: true
	}
)
