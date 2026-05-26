import { Request, Response } from "express";

import { pool } from "../config/db";

export async function createPlan(
  req: Request,
  res: Response
) {
  try {
    const {
      name,
      price,
      duration_days,
    } = req.body;

    if (
      !name ||
      !price ||
      !duration_days
    ) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO plans
      (
        name,
        price,
        duration_days
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        name,
        price,
        duration_days,
      ]
    );

    return res.status(201).json(
      result.rows[0]
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
}

export async function getPlans(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(
      `
      SELECT * FROM plans
      ORDER BY id DESC
      `
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
}