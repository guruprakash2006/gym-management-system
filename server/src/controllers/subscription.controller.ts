import { Request, Response } from "express";

import { pool } from "../config/db";

export async function createSubscription(
  req: Request,
  res: Response
) {
  try {
    const {
      member_id,
      plan_id,
    } = req.body;

    if (
      !member_id ||
      !plan_id
    ) {
      return res.status(400).json({
        message:
          "member_id and plan_id are required",
      });
    }

    const memberCheck =
      await pool.query(
        `
        SELECT * FROM members
        WHERE id = $1
        `,
        [member_id]
      );

    if (
      memberCheck.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Member not found",
      });
    }

    const planCheck =
      await pool.query(
        `
        SELECT * FROM plans
        WHERE id = $1
        `,
        [plan_id]
      );

    if (
      planCheck.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Plan not found",
      });
    }

    const plan =
      planCheck.rows[0];

    const startDate =
      new Date();

    const endDate =
      new Date();

    endDate.setDate(
      startDate.getDate() +
        plan.duration_days
    );

    const result =
      await pool.query(
        `
        INSERT INTO subscriptions
        (
          member_id,
          plan_id,
          start_date,
          end_date
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
          member_id,
          plan_id,
          startDate,
          endDate,
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

export async function getSubscriptions(
  _req: Request,
  res: Response
) {
  try {
    const result =
      await pool.query(
        `
        SELECT
          subscriptions.id,

          members.name AS member_name,

          plans.name AS plan_name,

          plans.price,

          subscriptions.start_date,

          subscriptions.end_date,

          subscriptions.status

        FROM subscriptions

        JOIN members
        ON subscriptions.member_id = members.id

        JOIN plans
        ON subscriptions.plan_id = plans.id

        ORDER BY subscriptions.id DESC
        `
      );

    return res.json(
      result.rows
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
}