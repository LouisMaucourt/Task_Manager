export function getCookie(name: string): string | null {
	const value = document.cookie
		.split("; ")
		.find((c) => c.startsWith(`${name}=`))
		?.split("=")[1];
	return value ? decodeURIComponent(value) : null;
}

export function setCookie(name: string, value: string) {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax; max-age=31536000`;
}
