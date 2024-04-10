import { events } from 'sveltekit-sse'
import { rooms, GetRoom, UpdateRoom } from '../../../../utils/rooms'
import { Evaluate } from "../../../../utils/poker";
import { type Room } from "../../../../utils/types";




function Ev(room: Room) {
  if (room.turn > 5 && !room.evaluated) {
	  for (let i = 0; i < room.names.length; i++) {
		  let name = room.names[i]
		  let player = room.players.get(name)
		  let hand = Evaluate([...player?.hand, ...room.table])
		  if (hand > room.rank) {
			  room.top = name
			  let h = +hand
			  room.rank = h
		  }
	  }
	  let winner = room.players.get(room.top)
	  if (winner) {
		  winner.wallet += room.pot  
	  }
	  room.players.set(room.top, winner)
	  room.pot = 0
	  room.evaluated = true
	  UpdateRoom(room.slug, room)
  }
}

export function POST({ request }) {
  return events({
    request,
    async start({emit}) {
	let i = 0
	rooms.subscribe(() => {
		let slug = request.url.toString().split("/")[3]
		let room = GetRoom(slug)
		if (room) {
		  Ev(room)
		}
		emit('message', JSON.stringify(room))
		i += 1
	})
    },
  })
}
