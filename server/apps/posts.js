import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const category = req.query.category;
  const keywords = req.query.title;

  const result = await pool.query(
    `select * from posts where title = $1 and category = $2`,
    [keywords, category]
  );

  return res.json({
    data: result.rows,
  });
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const result = await pool.query(`select * from posts where post_id =$1`, [
    postId,
  ]);
  return res.json({
    data: result.rows[0],
  });
});

postRouter.post("/", async (req, res) => {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  await pool.query(
    `INSERT INTO posts (user_id, title, content,likes, category, created_at,updated_at) VALUES ($1, $2, $3, $4, $5, $6,$7)`,
    [
      newPost.user_id,
      newPost.title,
      newPost.content,
      0,
      newPost.category,
      newPost.created_at,
      newPost.updated_at,
    ]
  );
  return res.json({
    message: "Post has been created.",
  });
});

postRouter.put("/:id", async (req, res) => {
  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
  };

  const postId = req.params.id;
  if (updatedPost.title && updatedPost.content) {
    await pool.query(
      `UPDATE posts SET title=$1,content=$2,likes=$3,category=$4 where post_id=$5`,
      [
        updatedPost.title,
        updatedPost.content,
        updatedPost.likes,
        updatedPost.category,
        postId,
      ]
    );
  } else if (!updatedPost.title && !updatedPost.content) {
    await pool.query(`UPDATE posts SET likes=$1 where post_id=$2`, [
      updatedPost.likes,
      postId,
    ]);
  }

  return res.json({
    message: `Post ${postId} has been updated.`,
  });
});

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  await pool.query(`delete from posts where post_id=$1`, [postId]);
  return res.json({
    message: `Post ${postId} has been deleted.`,
  });
});

postRouter.post("/:id/comments", async (req, res) => {
  let postid = req.params.id;
  const newPost = {
    ...req.body,
    created_at: new Date(),
    post_id: postid,
  };
  console.log(newPost);
  await pool.query(
    `INSERT INTO comments(user_id, comment,likes, created_at,post_id) VALUES ($1, $2, $3,$4,$5)`,
    [newPost.user_id, newPost.comment, 0, newPost.created_at, newPost.post_id]
  );
  return res.json({
    message: "comment has been created.",
  });
});
postRouter.put("/:id/comments/:commentsid", async (req, res) => {
  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
  };

  const postId = req.params.id;
  if (updatedPost.comment) {
    await pool.query(
      `UPDATE comments SET comment=$1,likes=$2 where post_id=$3`,
      [updatedPost.comment, updatedPost.likes, postId]
    );
  } else if (!updatedPost.comment) {
    await pool.query(`UPDATE comments SET likes=$1 where post_id=$2`, [
      updatedPost.likes,
      postId,
    ]);
  }

  return res.json({
    message: `comment ${postId} has been updated.`,
  });
});
postRouter.get("/:id/comments/:commentsid", async (req, res) => {
  const postId = req.params.id;
  const result = await pool.query(`select * from comments where post_id =$1`, [
    postId,
  ]);
  return res.json({
    data: result.rows[0],
  });
});
postRouter.delete("/:id/comments/:commentsid", async (req, res) => {
  const postId = req.params.id;
  await pool.query(`delete from comments where post_id=$1`, [postId]);
  return res.json({
    message: `Post ${postId} has been deleted.`,
  });
});

export default postRouter;
