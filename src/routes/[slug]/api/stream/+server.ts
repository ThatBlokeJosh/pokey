import { events } from 'sveltekit-sse'
import { rooms } from '../../../../utils/rooms'

export function POST({ request }) {
  return events({
    request,
    async start({emit}) {
	let i = 0
	rooms.subscribe((r) => {
		emit('message', i.toString())
		i += 1
	})
    },
  })
}
