import mongoose, { Schema } from 'mongoose';

const PacketSchema = new Schema({
    tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const packet = mongoose.model('Packet', PacketSchema);

export default packet;
