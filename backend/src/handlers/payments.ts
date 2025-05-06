import axios from "axios";
import { Router } from "express";
import platformAPIClient from "../services/platformAPIClient";
import "../types/session";

const router = Router();

// Example payment endpoint
router.post("/process", async (req, res) => {
  // Payment processing logic
  res.status(200).send({ message: "Payment processed" });
});

export default function mountPaymentsEndpoints(router: Router) {
  return router;
}
