import type { ZodObject } from "zod"
import { baseUrl } from "@/routes/__root.tsx"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

type RequestBuilderParams<T extends ZodObject> =
	| {
			URI: string
			includesCredentials: boolean
			includesBody: true
			method: "POST" | "PUT" | "PATCH"
			bodySchema: ZodObject
			body: unknown
			resSchema: T
	  }
	| {
			URI: string
			includesCredentials: boolean
			includesBody: false
			method: HTTPMethod
			resSchema: T
	  }

class RequestBuilder<T extends ZodObject> {
	private readonly path: string
	private readonly URI: string
	private _method?: HTTPMethod
	private _includesCredentials?: boolean
	private _includesBody: boolean = false
	private _bodySchema?: ZodObject
	private _body: unknown
	private readonly resSchema: T
	constructor(path: string, schema: T) {
		this.path = path
		this.URI = `${baseUrl}${this.path}`
		this.resSchema = schema
	}
	method(method: HTTPMethod) {
		this._method = method
		return this
	}
	includesCredentials(includesCredentials: boolean) {
		this._includesCredentials = includesCredentials
		return this
	}
	includesBody(includesBody: boolean) {
		this._includesBody = includesBody
		return this
	}
	body(bodySchema: ZodObject, body: unknown) {
		this._bodySchema = bodySchema
		this._body = this._bodySchema.parse(body)
		return this
	}
	build(): MakeRequest<T> {
		if (!this._method) {
			throw new Error("Method not specified")
		}
		if (!this._includesCredentials) {
			throw new Error("Specify if credentials are required")
		}
		if (this._includesBody && !this._bodySchema) {
			throw new Error("Request Body and Schema not specified")
		}
		let params: RequestBuilderParams<T>
		if (this._includesBody) {
			params = {
				URI: this.URI,
				method: this._method as "POST" | "PATCH" | "PUT",
				body: this._body,
				bodySchema: this._bodySchema as ZodObject,
				includesBody: true,
				includesCredentials: this._includesCredentials,
				resSchema: this.resSchema
			}
		} else {
			params = {
				URI: this.URI,
				method: this._method,
				includesBody: false,
				includesCredentials: this._includesCredentials,
				resSchema: this.resSchema
			}
		}
		return new MakeRequest<T>(params)
	}
}

class MakeRequest<T extends ZodObject> {
	private readonly URI: string
	private readonly method: HTTPMethod
	private readonly includesCredentials: boolean
	private readonly includesBody: boolean
	private readonly body: unknown
	private readonly resSchema: T
	constructor(params: RequestBuilderParams<T>) {
		const { method, resSchema, URI, includesCredentials, includesBody } = params
		this.method = method
		this.includesCredentials = includesCredentials
		this.includesBody = includesBody
		if (includesBody) {
			this.body = params.body
		}
		this.resSchema = resSchema
		this.URI = URI
	}
	async sendRequest() {
		if (this.includesBody) {
			const req = await fetch(this.URI, {
				method: this.method,
				headers: { "content-type": "application/json" },
				credentials: this.includesCredentials ? "include" : "omit",
				body: JSON.stringify(this.body)
			})
			return this.resSchema.safeParse(await req.json())
		}
		const req = await fetch(this.URI, {
			method: this.method,
			headers: { "content-type": "application/json" },
			credentials: this.includesCredentials ? "include" : "omit"
		})
		return this.resSchema.safeParse(await req.json())
	}
}

export default RequestBuilder
