import React, { useState, useEffect } from "react";
import "./FollowButton.scss";
import newRequest from "../../utils/newRequest";
import { useQueryClient } from "@tanstack/react-query";

const FollowButton = ({ userId, size = "small" }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  // Check if the current user is following this user
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUser) return;
      
      try {
        const res = await newRequest.get(`/follows/status/${userId}`);
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    checkFollowStatus();
  }, [userId, currentUser]);

  const handleFollow = async (e) => {
    e.preventDefault(); // Prevent navigation when used inside links
    e.stopPropagation(); // Prevent event bubbling
    
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = "/login";
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isFollowing) {
        // Unfollow
        await newRequest.delete(`/follows/${userId}`);
      } else {
        // Follow
        await newRequest.post("/follows", { followedId: userId });
      }
      
      // Toggle state
      setIsFollowing(!isFollowing);
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries(["user", userId]);
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
      console.error("Error following/unfollowing:", err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (currentUser && currentUser._id === userId) {
    return null;
  }

  return (
    <button 
      className={`follow-button ${size} ${isFollowing ? "following" : ""}`}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? (
        <span className="loading">...</span>
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
      {error && <div className="error-tooltip">{error}</div>}
    </button>
  );
};

export default FollowButton;