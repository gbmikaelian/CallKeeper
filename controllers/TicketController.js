import { Packet, Ticket } from '../models';
import Controller from './Controller';

export default class TicketController extends Controller {
    getPackets = async (req, res) => {
        try {
            const packets = await Packet.find().populate({
                path: 'tickets',
                select: '-packet -__v',
                options: { sort: { step: 1 } }
            });
            return res.json({ packets });
        } catch (e) {
            console.log(e);
            return res.json({ success: false, error: e.message });
        }
    }

    getTickets = async (req, res) => {
        try {
            const tickets = await Ticket.find();
            return res.json({ tickets });
        } catch (e) {
            console.log(e);
            return res.json({ success: false, error: e.message });
        }
    }

    getPacket = async (req, res) => {
        try {
            const packet = await Packet.findById(req.params.id).populate({
                path: 'tickets',
                select: '-createdAt -packet -__v',
                options: { sort: { step: 1 } }
            });

            return res.json({ packet });
        } catch (e) {
            console.log(e);
            return res.json({ success: false, error: e.message });
        }
    }

    createTicket = async (req, res) => {
        try {
            const saveAll = [];
            const packet = new Packet();

            const tickets = this.sortTickets(req.body);

            const [ticket] = tickets.filter(v => v.baggage);
            const baggage = ticket.baggage;

            console.log(ticket);

            tickets.forEach((v, k) => {
                const ticket = new Ticket();
                ticket.packet = packet._id;
                ticket.step = k + 1;
                ticket.departure = v.departure;
                ticket.destination = v.destination;
                ticket.seat = v.seat;
                ticket.transport_type = v.transport_type;
                ticket.departure_point = v.departure_point;
                ticket.transport_number = v.transport_number;
                ticket.baggage = baggage;
                packet.tickets.push(ticket);
                saveAll.push(() => ticket.save());
            });

            await Promise.all([...saveAll.map(v => v()), packet.save()]);

            return res.json({ packet });
        } catch (e) {
            console.log(e);
            return res.json({ success: false, error: e.message });
        }
    }

    firstStep = (tickets) => {
        const firstCountry = [];
        tickets.forEach(ticket => {
            tickets.forEach(v => {
                if (v.departure === ticket.destination) {
                    firstCountry.push(v.departure);
                }
            });
        });

        const [ticket] = tickets.filter(ticket => !firstCountry.includes(ticket.departure));
        return ticket;
    }

    sortTickets = (tickets) => {
        const sortedTickets = [this.firstStep(tickets)];

        for (const newTicket of sortedTickets) {
            tickets.forEach(ticket => {
                if (newTicket.destination === ticket.departure) {
                    sortedTickets.push(ticket);
                }
            });
        }
        return sortedTickets;
    }
}
