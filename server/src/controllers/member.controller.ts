import { Request, Response } from "express";
import { pool } from "../config/db";

// CREATE MEMBER
export async function createMember(
  req: Request,
  res: Response
) {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        message:
          "Both name and phone are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO members (name, phone)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, phone]
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

// GET MEMBERS
export async function getMembers(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM members
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

// UPDATE MEMBER
export async function updateMember(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { name, phone } =
      req.body;

    const result = await pool.query(
      `
      UPDATE members
      SET
        name = $1,
        phone = $2
      WHERE id = $3
      RETURNING *
      `,
      [name, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Member not found",
      });
    }

    return res.json(
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

// DELETE MEMBER
export async function deleteMember(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM members
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Member not found",
      });
    }

    return res.json({
      message:
        "Member deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
}