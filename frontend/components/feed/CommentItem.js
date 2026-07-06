"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Avatar from "./Avatar";
import LikersModal from "./LikersModal";

export default function CommentItem({ comment, isReply = false, postId, onReplyCreated }) {
  const { token, user } = useAuth();

  const [liked, setLiked] = useState(comment.liked_by_me);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showLikers, setShowLikers] = useState(false);
  const [busy, setBusy] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  async function submitReply(e) {
    e.preventDefault();
    if (!replyBody.trim() || replySubmitting) return;
    setReplySubmitting(true);
    try {
      const res = await api(`/posts/${postId}/comments`, {
        method: "POST",
        token,
        body: { body: replyBody, parent_id: comment.id },
      });
      onReplyCreated?.(comment.id, res.data);
      setReplyBody("");
      setShowReplyBox(false);
    } catch {
      // keep box open so the text isn't lost
    } finally {
      setReplySubmitting(false);
    }
  }

  async function toggleLike() {
    if (busy) return;
    setBusy(true);

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount((c) => c + (liked ? -1 : 1));

    try {
      const res = await api(`/comments/${comment.id}/like`, { method: "POST", token });
      setLiked(res.data?.liked ?? !prevLiked);
      if (typeof res.data?.likes_count === "number") setLikesCount(res.data.likes_count);
    } catch {
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`_comment_main${isReply ? " _comment_main_reply" : ""}`}>
      <div className="_comment_image">
        <a href="#0" onClick={(e) => e.preventDefault()} className="_comment_image_link">
          <Avatar src={comment.user.profile_picture} name={comment.user.full_name} size={32} className="_comment_img1" />
        </a>
      </div>
      <div className="_comment_area" style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0" onClick={(e) => e.preventDefault()}>
                <h4 className="_comment_name_title">{comment.user.full_name}</h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text" style={{ overflowWrap: "anywhere" }}><span>{comment.body}</span></p>
          </div>
          {likesCount > 0 && (
            <div className="_total_reactions" onClick={() => setShowLikers(true)} role="button" style={{ cursor: "pointer" }}>
              <div className="_total_react">
                <span className="_reaction_like">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                </span>
                <span className="_reaction_heart">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </span>
              </div>
              <span className="_total">{likesCount}</span>
            </div>
          )}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list" style={{ whiteSpace: "nowrap" }}>
                <li>
                  <span onClick={toggleLike} role="button" style={{ cursor: "pointer", fontWeight: liked ? 700 : undefined }}>
                    {liked ? "Liked." : "Like."}
                  </span>
                </li>
                {!isReply && (
                  <li>
                    <span onClick={() => setShowReplyBox((v) => !v)} role="button" style={{ cursor: "pointer" }}>
                      Reply.
                    </span>
                  </li>
                )}
                <li><span>Share</span></li>
                <li><span className="_time_link" style={{ whiteSpace: "nowrap" }}>{comment.created_at}</span></li>
              </ul>
            </div>
          </div>
        </div>


        {/* nested reply */}
        {showReplyBox && !isReply && (
          <div className="_feed_inner_comment_box">
            <form className="_feed_inner_comment_box_form" onSubmit={submitReply}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <Avatar src={user?.profile_picture} name={user?.full_name || ""} size={32} className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a comment"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) submitReply(e);
                    }}
                    rows={1}
                    autoFocus
                  ></textarea>
                </div>
              </div>
              <button type="submit" hidden aria-hidden="true" disabled={replySubmitting}></button>
            </form>
          </div>
        )}

        {/* replies */}
        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply postId={postId} />
        ))}
      </div>

      {showLikers && (
        <LikersModal type="comments" id={comment.id} onClose={() => setShowLikers(false)} />
      )}
    </div>
  );
}