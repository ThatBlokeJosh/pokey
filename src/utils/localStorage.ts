const KEY = "name"

export function SetName(name: string) {
	localStorage.setItem(KEY, name)
}

export function GetName(): string {
	let name = localStorage.getItem(KEY)
	if (name === null) {
		return ""
	}
	return name
}
