"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Avatar from "./Avatar";

export default function LikersModal({ type, id, onClose }) {
  const { token } = useAuth();
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/${type}/${id}/likes`, { token })
      .then((res) => setLikers(res.data?.likers ?? []))
      .catch((err) => setError(err.message || "Failed to load likes."))
      .finally(() => setLoading(false));
  }, [type, id, token]);

  // close on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,.5)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="People who liked this"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div
          className="modal-content _b_radious6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
            <h4 className="_feed_inner_timeline_post_box_title" style={{ margin: 0 }}>
              Likes
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {loading && (
              <p className="_feed_inner_timeline_post_box_para">Loading...</p>
            )}

            {error && (
              <p className="_feed_inner_timeline_post_box_para" style={{ color: "red" }}>
                {error}
              </p>
            )}

            {!loading && !error && likers.length === 0 && (
              <p className="_feed_inner_timeline_post_box_para">No likes yet.</p>
            )}

            {likers.map((u) => (
              <div
                key={u.id}
                className="d-flex align-items-center"
                style={{ gap: 10, marginBottom: 14 }}
              >
                <Avatar src={u.profile_picture} name={u.full_name} size={36} />
                <h4
                  className="_feed_inner_timeline_post_box_title"
                  style={{ margin: 0, fontSize: 14 }}
                >
                  {u.full_name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}