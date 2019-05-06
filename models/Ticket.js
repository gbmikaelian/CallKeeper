import mongoose, { Schema } from 'mongoose';

const ticketSchema = new Schema({
    packet: {
        ref: 'Packet',
        type: Schema.Types.ObjectId
    },
    step: Number,
    departure: String,
    destination: String,
    seat: String,
    transport_type: String,
    departure_point: String,
    transport_number: String,
    baggage: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ticket = mongoose.model('Ticket', ticketSchema);

export default ticket;
