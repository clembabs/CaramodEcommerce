const  express  = require("express");
const { createUser, loginUser, getAllUsers, getASingleUser, deleteAUser, updateUser, blockAUser, unblockAUser } = require("../controller/user_controller");
const {authMiddleware,isAdmin} = require("../middlewares/auth_middleware");
const router =  express.Router();


router.post("/register",createUser);
router.post("/login",loginUser);
router.get("/all-users",authMiddleware,isAdmin, getAllUsers);
router.get("/:id",getASingleUser);
router.delete("/:id",deleteAUser);
router.put("/edit-user",authMiddleware,updateUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockAUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockAUser);
module.exports = router;
