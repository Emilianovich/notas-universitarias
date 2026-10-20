export default function LoginBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			<svg
				viewBox="0 0 1440 900"
				preserveAspectRatio="xMidYMid slice"
				className="h-full w-full"
				aria-hidden="true"
			>
				<defs>
					<linearGradient id="login-ribbon">
						<stop
							offset="0%"
							stopColor="var(--color-primary-300)"
							stopOpacity="0.12"
						/>
						<stop
							offset="100%"
							stopColor="var(--color-secondary)"
							stopOpacity="0.36"
						/>
					</linearGradient>
				</defs>

				<path
					d="M1160 -160 C1000 -65 1005 120 1145 210 C1255 285 1390 265 1520 170"
					fill="none"
					stroke="url(#login-ribbon)"
					strokeWidth="125"
					strokeLinecap="round"
				/>

				<path
					d="M-210 240 C-5 180 150 265 170 415 C187 542 72 620 -105 650"
					fill="none"
					stroke="var(--color-primary-300)"
					strokeOpacity="0.075"
					strokeWidth="105"
					strokeLinecap="round"
				/>

				<path
					d="M1600 665 C1395 620 1280 725 1270 935"
					fill="none"
					stroke="var(--color-primary-300)"
					strokeOpacity="0.075"
					strokeWidth="155"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	)
}
