const express = require("express");
const router = express.Router();

const { ProblemController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", ProblemController.getAllProblem);
router.get("/:idProblem", ProblemController.getInfoProblem);
router.post("", checkToken, ProblemController.createProblem);
router.get("/correctAnswer/:idProblem", checkToken, ProblemController.toggleCorrectAnswer);

module.exports = router;