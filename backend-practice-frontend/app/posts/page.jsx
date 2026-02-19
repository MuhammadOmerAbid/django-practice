"use client";

import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import "../../styles/global.css";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState({ type: null, text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchPosts = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get("/posts/");
      setPosts(res.data.results || res.data);
      setMessage({ type: null, text: "" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load posts" });
    } finally {
      setIsFetching(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: "" });

    try {
      await axios.post("/posts/", { title, content });
      setTitle("");
      setContent("");
      setMessage({ type: "success", text: "Post created successfully!" });
      fetchPosts();
    } catch (err) {
      console.error(err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to create post" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="auth-container">
      {/* Background blobs */}
      <div className="blob blob1" aria-hidden="true"></div>
      <div className="blob blob2" aria-hidden="true"></div>
      <div className="blob blob3" aria-hidden="true"></div>

      {/* Card wrapper */}
      <div className="auth-card">
        <h1 className="auth-title">Posts</h1>
        <p className="auth-subtitle">Create and view posts</p>

        {/* Create Post Form */}
        <form onSubmit={createPost} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              minLength={10}
              maxLength={1000}
              disabled={isLoading}
            />
            <p className="auth-hint">{content.length}/1000</p>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Post"}
          </button>

          {message.type && (
            <p className={`auth-message ${message.type}`} role="alert">
              {message.text}
            </p>
          )}
        </form>

        {/* Posts List */}
        <div className="posts-section">
          <h2 className="posts-section-title">All Posts</h2>

          {isFetching ? (
            <p className="auth-loading">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="auth-empty">No posts yet. Create your first post!</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="posts-item">
                  <h3 className="posts-item-title">{post.title}</h3>
                  <span className="posts-item-owner">@{post.owner || "anonymous"}</span>
                  <p className="posts-item-content">{post.content}</p>
                  {post.created_at && (
                    <time className="posts-item-date">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
