import express from "express";
import { Register,Login,RefreshToken,Logout} from "../controllers/authController.js";
const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh-token', RefreshToken);
router.post('/logout', Logout);

export default router;
