"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Navbar from "@/components/feed/Navbar";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import Stories from "@/components/feed/Stories";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";

export default function FeedPage() {
  const { token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [error, setError] = useState("");

  const sentinelRef = useRef(null);

  const stateRef = useRef({ nextCursor: null, hasMore: true, loadingFeed: false });
  stateRef.current = { nextCursor, hasMore, loadingFeed };

  const loadPosts = useCallback(
    async (cursor = null) => {
      if (!token) return;
      setLoadingFeed(true);
      setError("");
      try {
        const res = await api(`/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`, {
          token,
        });
        setPosts((prev) => (cursor ? [...prev, ...res.data] : res.data));
        setNextCursor(res.next_cursor ?? null);
        setHasMore(res.has_more ?? false);
      } catch (err) {
        setError(err.message || "Failed to load feed.");
      } finally {
        setLoadingFeed(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    // On desktop the feed scrolls inside a container (._layout_middle_wrap),
    // not the window — so the observer must use that container as its root.
    // On mobile there's no scrollable ancestor, so it falls back to the viewport.
    const getScrollParent = (node) => {
      let cur = node.parentElement;
      while (cur) {
        const oy = getComputedStyle(cur).overflowY;
        if ((oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight) {
          return cur;
        }
        cur = cur.parentElement;
      }
      return null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const { nextCursor, hasMore, loadingFeed } = stateRef.current;
        if (entries[0].isIntersecting && hasMore && !loadingFeed) {
          loadPosts(nextCursor);
        }
      },
      { root: getScrollParent(el), rootMargin: "400px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadPosts, posts.length, hasMore]);

  return (
    <RequireAuth>
      <div className="_layout _layout_main_wrapper">

        {/* switching btn */}
        <div className="_layout_mode_swithing_btn">
          <button type="button" className="_layout_swithing_btn_link">
            <div className="_layout_swithing_btn">
              <div className="_layout_swithing_btn_round">

              </div>
            </div>
            <div className="_layout_change_btn_ic1">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
                <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" />
              </svg>
            </div>
            <div className="_layout_change_btn_ic2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
                <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
              </svg>
            </div>
          </button>
        </div>

        <div className="_main_layout">
          <Navbar />

          {/* main layout */}
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">

                {/* left sidebar */}
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                  <LeftSidebar />
                </div>

                {/* layout middle */}
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="_layout_middle_wrap">
                    <div className="_layout_middle_inner">
                      <Stories />
                      <CreatePost onCreated={(post) => setPosts((prev) => [post, ...prev])} />

                      {error && (
                        <p style={{ color: "red", textAlign: "center" }}>
                          {error}{" "}
                          <button type="button" onClick={() => loadPosts(nextCursor)}>
                            Retry
                          </button>
                        </p>
                      )}

                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}

                      {/* Infinite scroll sentinel */}
                      <div ref={sentinelRef} style={{ height: 1 }} />

                      {loadingFeed && (
                        <p style={{ textAlign: "center" }}>Loading...</p>
                      )}

                      {!loadingFeed && posts.length === 0 && !error && (
                        <p style={{ textAlign: "center", opacity: 0.6 }}>
                          No posts yet. Be the first to share something!
                        </p>
                      )}

                      {!hasMore && posts.length > 0 && (
                        <p style={{ textAlign: "center", opacity: 0.6 }}>
                          You&apos;re all caught up
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* right sidebar */}
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                  <RightSidebar />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}