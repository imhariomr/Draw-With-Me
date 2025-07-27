import { Router } from "express";
import { createRoom, getAllShapes,getAllRooms,deleteShape } from "../controller/shape.controller";

const router: Router = Router();

router.post('/createRoom',createRoom);
router.get('/getRooms',getAllRooms);
router.get('/getShapes/:slug',getAllShapes);
router.delete('/deleteShape',deleteShape);


export default router;
