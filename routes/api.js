import { Router } from 'express';
import { UserController, TicketController } from '../controllers';

const userController = new UserController();
const ticketController = new TicketController();
const router = new Router();

router.get('/me', userController.me);
router.post('/ticket', ticketController.createTicket);
router.get('/tickets', ticketController.getTickets);
router.get('/packets', ticketController.getPackets);
router.get('/packet/:id', ticketController.getPacket);

export default router;