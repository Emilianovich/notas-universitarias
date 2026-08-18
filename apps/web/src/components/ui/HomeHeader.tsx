import Header, { SettingsIcon } from "@/components/general/Header.tsx"
import { Nav, NavOption } from "@/components/general/Nav.tsx"
import LogoutIcon from "@/components/ui/LogoutIcon.tsx"

export default function HomeHeader() {
	return (
		<Header>
			<Nav>
				<NavOption
					navigateTo={"/home/current-period"}
					text={"Periodo actual"}
				/>
				<NavOption navigateTo={"/home/history"} text={"Historial"} />
				<NavOption
					navigateTo={"/home/register-period"}
					text={"Registrar periodo"}
				/>
			</Nav>
			<div
				className={
					"absolute right-8 top-1/2 -translate-y-1/2 w-fit h-fit flex gap-4"
				}
			>
				<LogoutIcon />
				<SettingsIcon />
			</div>
		</Header>
	)
}
