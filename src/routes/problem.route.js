const express = require("express");
const router = express.Router();

const { ProblemController } = require("../controllers");
const { checkToken } = require("../middleware");

router.get("", ProblemController.getAllProblem);
router.get("/manager", checkToken, ProblemController.managerProblem);
router.get("/count-max-page", ProblemController.countMaxPageProblem);
router.get("/:idProblem", ProblemController.getInfoProblem);
router.post("", checkToken, ProblemController.createProblem);
router.get("/correctAnswer/:idProblem", checkToken, ProblemController.toggleCorrectAnswer);
router.put("/:idProblem", checkToken, ProblemController.editProblem);
router.delete("/:idProblem", checkToken, ProblemController.deleteProblem);

module.exports = router;