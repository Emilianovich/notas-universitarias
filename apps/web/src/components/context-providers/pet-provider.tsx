import { type ReactNode, useState } from "react"
import defaultSettings from "@/components/context-providers/default-settings.ts"
import Pet from "@/components/general/Pet.tsx"
import usePet, { PetContext } from "@/contexts/pet.ts"
import useSettings from "@/contexts/settings.ts"

const numberOfCategories = 5
const numberOfFacts = 15
type FactsCategory =
	| "astronomy"
	| "psychology"
	| "nature"
	| "human-body"
	| "football"
type PetFacts = {
	category: FactsCategory
	facts: string[]
}

export function generatePetFact(facts: PetFacts[]): string {
	const selectedCategory = Math.floor(Math.random() * numberOfCategories)
	const selectedFact = Math.floor(Math.random() * numberOfFacts)
	let keyOfCategory: FactsCategory
	switch (selectedCategory) {
		case 0:
			keyOfCategory = "astronomy"
			break
		case 1:
			keyOfCategory = "psychology"
			break
		case 2:
			keyOfCategory = "nature"
			break
		case 3:
			keyOfCategory = "human-body"
			break
		case 4:
			keyOfCategory = "football"
			break
		default:
			keyOfCategory = "nature"
			break
	}
	return facts.find((fact) => fact.category === keyOfCategory)?.facts[
		selectedFact
	] as string
}

export const facts: PetFacts[] = [
	{
		category: "astronomy",
		facts: [
			"Si cayeras en un agujero negro supermasivo, podrías cruzar el horizonte de eventos sin darte cuenta de inmediato.",
			"Un día en Venus dura más que un año en Venus.",
			"Existen planetas donde llueve vidrio derretido impulsado por vientos supersónicos.",
			"La luz del Sol tarda aproximadamente 8 minutos y 20 segundos en llegar a la Tierra.",
			"Hay estrellas tan grandes que, si reemplazaran al Sol, engullirían la órbita de Marte.",
			"Los agujeros negros no son aspiradoras cósmicas; solo atraen materia igual que cualquier objeto con la misma masa.",
			"La galaxia Andrómeda se dirige hacia la Vía Láctea a unos 110 km por segundo.",
			"Algunas estrellas de neutrones giran cientos de veces por segundo.",
			"El universo observable contiene más estrellas que granos de arena hay en todas las playas de la Tierra.",
			"Los científicos han detectado exoplanetas con dos o incluso tres soles visibles en su cielo.",
			"Un agujero negro puede deformar tanto el espacio-tiempo que la luz queda atrapada.",
			"Existen nubes gigantes en el espacio compuestas por alcohol y otras moléculas orgánicas.",
			"El objeto más frío conocido por la ciencia fue creado artificialmente en la Tierra y es más frío que el espacio profundo.",
			"La gravedad de la Luna provoca mareas y también deforma ligeramente la corteza terrestre.",
			"Mirar galaxias lejanas es literalmente observar el pasado del universo."
		]
	},
	{
		category: "psychology",
		facts: [
			"Tu cerebro puede inventar recuerdos sin que te des cuenta.",
			"La mayoría de las personas cree estar por encima del promedio en inteligencia o habilidades sociales.",
			"Cuanto más familiar te resulta algo, más probable es que te guste.",
			"Los sueños suelen incorporar estímulos reales del entorno mientras duermes.",
			"Tu cerebro llena automáticamente puntos ciegos en tu visión.",
			"Las personas tienden a buscar información que confirme sus creencias previas.",
			"Recordar algo muchas veces puede alterar el recuerdo original.",
			"El efecto placebo puede producir cambios físicos medibles en el cuerpo.",
			"A menudo tomamos decisiones emocionales y luego las justificamos con lógica.",
			"La música puede modificar tu percepción del tiempo.",
			"Los seres humanos son sorprendentemente malos para predecir qué los hará felices a largo plazo.",
			"Cuando ves una cara en una nube o una roca, estás experimentando pareidolia.",
			"El miedo a perder algo suele ser más fuerte que el deseo de ganar algo equivalente.",
			"Dormir poco reduce la capacidad de detectar errores en tus propios pensamientos.",
			"Tu cerebro procesa gran parte de la información antes de que seas consciente de ella."
		]
	},
	{
		category: "nature",
		facts: [
			"El camarón pistola genera una burbuja tan potente que alcanza temperaturas comparables a las de la superficie solar durante una fracción de segundo.",
			"Los tardígrados pueden sobrevivir al vacío del espacio.",
			"Algunas medusas son capaces de revertir su ciclo de vida y volver a una etapa juvenil.",
			"El pulpo tiene tres corazones y sangre azul.",
			'Existen hongos que convierten insectos en "zombis" para propagarse.',
			"Algunas plantas carnívoras pueden atrapar presas en menos de una décima de segundo.",
			"El pez hielo antártico posee proteínas naturales anticongelantes en su sangre.",
			"Hay lagos tan ácidos que disolverían rápidamente la mayoría de los organismos.",
			"Las secuoyas gigantes pueden superar los 80 metros de altura y vivir más de 2.000 años.",
			"El camarón mantis golpea tan rápido que crea pequeñas ondas de choque bajo el agua.",
			"Algunas hormigas forman puentes vivos utilizando sus propios cuerpos.",
			"El axolote puede regenerar extremidades, partes del corazón e incluso tejido cerebral.",
			"Existen bacterias que prosperan en fuentes hidrotermales donde el agua supera los 100 °C.",
			"Algunos árboles se comunican mediante redes subterráneas conectadas por hongos.",
			"La anguila eléctrica puede generar descargas superiores a 800 voltios."
		]
	},
	{
		category: "human-body",
		facts: [
			"Tu cerebro consume alrededor del 20% de la energía total de tu cuerpo.",
			"Cada segundo mueren millones de células en tu organismo y son reemplazadas por otras nuevas.",
			"No puedes hacerte cosquillas a ti mismo de la misma manera que otra persona.",
			"Tus huesos son más resistentes que el concreto en relación con su peso.",
			"La nariz puede distinguir billones de combinaciones de olores.",
			"Mientras lees esta frase, tus ojos realizan pequeños movimientos constantes.",
			"Tu cuerpo produce nuevas células sanguíneas todos los días.",
			"El estómago genera una nueva capa protectora regularmente para evitar digerirse a sí mismo.",
			"Parte de la sensación de sabor proviene realmente del olfato.",
			"Los músculos de los ojos son de los más activos del cuerpo.",
			"La piel es el órgano más grande del organismo humano.",
			"Tu cerebro sigue procesando sonidos mientras duermes.",
			"El corazón genera un campo eléctrico detectable a cierta distancia del cuerpo.",
			"La mayoría de las personas respira por una fosa nasal más que por la otra en distintos momentos del día.",
			"Tu sistema inmunológico guarda memoria de infecciones pasadas durante años o incluso décadas."
		]
	},
	{
		category: "football",
		facts: [
			"El primer Mundial se celebró en Uruguay en 1930.",
			"Pelé es el único jugador que ganó tres Copas del Mundo.",
			'Diego Maradona marcó en el mismo partido el famoso "Gol del Siglo" y la "Mano de Dios".',
			"Real Madrid ganó las primeras cinco ediciones de la Copa de Europa.",
			"Lionel Messi posee una de las mayores colecciones de Balones de Oro de la historia.",
			"Cristiano Ronaldo es uno de los máximos goleadores del fútbol profesional.",
			"La final del Mundial de 1950 en el estadio Maracaná registró una de las mayores asistencias de la historia.",
			"AC Milan protagonizó algunas de las dinastías más dominantes del fútbol europeo.",
			"El Mundial de 1982 fue el primero con 24 selecciones participantes.",
			"Johan Cruyff popularizó una forma de entender el juego que sigue influyendo décadas después.",
			"FC Barcelona de 2009 ganó seis títulos oficiales en un mismo año.",
			"Lev Yashin es el único portero que ha ganado el Balón de Oro.",
			"La UEFA Champions League es la competición de clubes más prestigiosa del mundo.",
			"Zinedine Zidane marcó dos goles de cabeza en la final del Mundial de 1998.",
			"La rivalidad entre Real Madrid y FC Barcelona es una de las más seguidas en todo el planeta."
		]
	}
]

export default function PetProvider({ children }: { children: ReactNode }) {
	const [isHovered, setIsHovered] = useState(false)
	const togglePetHover = () => {
		setIsHovered(!isHovered)
	}
	return (
		<PetContext.Provider value={{ isHovered, togglePetHover }}>
			<Pet />
			{children}
		</PetContext.Provider>
	)
}

export function Fact() {
	const { isHovered } = usePet()
	const { fontFamily } = useSettings() ?? defaultSettings
	if (isHovered) {
		return (
			<div
				id="pet-provider-fact"
				className={`speech-bubble p-4 opacity-100 ${isHovered ? "opacity-100" : ""}`}
				style={{ fontFamily }}
			>
				<p className={"sm:text-xs lg:text-base"}>{generatePetFact(facts)}</p>
			</div>
		)
	}
}
