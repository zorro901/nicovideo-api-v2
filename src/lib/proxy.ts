export function withProxyUrl({
	proxyUrl,
	url,
}: { proxyUrl: string; url: string }) {
	const proxyUrlEndsWithSlash = proxyUrl.endsWith('/')
		? proxyUrl
		: `${proxyUrl}/`
	return `${proxyUrl === '' ? '' : proxyUrlEndsWithSlash}${url}`
}
