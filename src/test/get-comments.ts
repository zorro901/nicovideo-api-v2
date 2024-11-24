import { createClient } from '@/index'

const client = createClient()
try {
	const result = await client.getComments('sm44158937')
	console.dir(result, { depth: 3 })
} catch (error) {
	console.error('Error fetching data from NicoVideo API:', error)
}
