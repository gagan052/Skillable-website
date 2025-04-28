import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    orders: 0,
    messages: 0,
    gigs: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize with default values to ensure display even if API calls fail
  useEffect(() => {
    // Set default values after a short delay to ensure UI is responsive
    const initTimer = setTimeout(() => {
      if (loading) {
        // Force stats to display with default values
        setStats(prevStats => ({
          ...prevStats,
          orders: prevStats.orders || 0,
          messages: prevStats.messages || 0,
          gigs: prevStats.gigs || 0
        }));
        
        // Ensure loading state is cleared after initialization
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(initTimer);
  }, [loading]);
  
  // Ensure stats are always displayed with valid values
  const displayStats = {
    orders: stats.orders || 0,
    messages: stats.messages || 0,
    gigs: stats.gigs || 0
  };

  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  
  // Set a timeout to ensure loading state is cleared even if API calls are slow
  useEffect(() => {
    // Short timeout for better user experience - show data quickly
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        // Force display of any available data
        setStats(prevStats => ({
          orders: prevStats.orders || 0,
          messages: prevStats.messages || 0,
          gigs: prevStats.gigs || 0
        }));
      }
    }, 1500); // 1.5 seconds timeout for better user experience
    
    return () => clearTimeout(loadingTimeout);
  }, [loading]);
  
  // Handle error display separately
  useEffect(() => {
    if (error) {
      // Clear error after 5 seconds to improve user experience
      const errorTimeout = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(errorTimeout);
    }
  }, [error]);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      // Set a maximum time for the API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      try {
        // Get orders count
        let ordersCount = 0;
        let messagesCount = 0;
        let gigsCount = 0;
        
        // Fetch orders
        try {
          const ordersRes = await newRequest.get("/orders", { signal: controller.signal });
          if (Array.isArray(ordersRes.data)) {
            // Filter orders for the current user
            const userOrders = ordersRes.data.filter(order => 
              order.buyerId === currentUser._id || 
              (currentUser.isSeller && order.sellerId === currentUser._id)
            );
            ordersCount = userOrders.length;
          }
        } catch (orderErr) {
          console.log("Error fetching orders:", orderErr);
        }
        
        // Fetch messages/conversations
        try {
          const conversationsRes = await newRequest.get("/conversations", { signal: controller.signal });
          if (Array.isArray(conversationsRes.data)) {
            messagesCount = conversationsRes.data.length;
          }
        } catch (msgErr) {
          console.log("Error fetching conversations:", msgErr);
        }
        
        // Fetch gigs if user is a seller
        if (currentUser.isSeller) {
          try {
            const gigsRes = await newRequest.get("/gigs", { signal: controller.signal });
            if (Array.isArray(gigsRes.data)) {
              // Filter gigs by current user ID
              const userGigs = gigsRes.data.filter(gig => 
                gig.userId === currentUser._id
              );
              gigsCount = userGigs.length;
            }
          } catch (gigErr) {
            console.log("Error fetching gigs:", gigErr);
          }
        }
        
        // Update stats regardless of individual API call failures
        setStats({
          orders: ordersCount,
          messages: messagesCount,
          gigs: gigsCount
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        // Always set loading to false when all operations are complete
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    
    fetchStats();
    
    // Force loading to complete after a maximum time
    const maxLoadingTime = setTimeout(() => {
      setLoading(false);
    }, 4000);
    
    return () => clearTimeout(maxLoadingTime);
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="dashboard">
      <div className="container">
        <h1>User Dashboard</h1>
        <div className="user-info">
          <div className="profile-section">
            <div className="profile-image">
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="Profile" />
            </div>
            <div className="profile-details">
              <h2>{currentUser.username}</h2>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Account Type:</strong> {currentUser.isSeller ? "Seller" : "Buyer"}</p>
              <p><strong>Member Since:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
              <p><strong>Country:</strong> {currentUser.country || "Not specified"}</p>
            </div>
          </div>

          <div className="stats-section">
            <h3>Account Statistics</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Orders</h4>
                <p className="stat-number">
                  {loading ? (
                    <span className="loading-text">Loading...</span>
                  ) : (
                    <span className="stat-value" key={`orders-${displayStats.orders}`}>{displayStats.orders}</span>
                  )}
                </p>
                <a href="/orders">View Orders</a>
              </div>
              <div className="stat-card">
                <h4>Messages</h4>
                <p className="stat-number">
                  {loading ? (
                    <span className="loading-text">Loading...</span>
                  ) : (
                    <span className="stat-value" key={`messages-${displayStats.messages}`}>{displayStats.messages}</span>
                  )}
                </p>
                <a href="/messages">View Messages</a>
              </div>
              {currentUser.isSeller && (
                <div className="stat-card">
                  <h4>Gigs</h4>
                  <p className="stat-number">
                    {loading ? (
                      <span className="loading-text">Loading...</span>
                    ) : (
                      <span className="stat-value" key={`gigs-${displayStats.gigs}`}>{displayStats.gigs}</span>
                    )}
                  </p>
                  <a href="/mygigs">View Gigs</a>
                </div>
              )}
            </div>
          </div>

          {currentUser.isSeller && (
            <div className="seller-section">
              <h3>Seller Information</h3>
              <p><strong>Description:</strong> {currentUser.desc || "No description provided"}</p>
              <div className="seller-actions">
                <button onClick={() => navigate("/add")}>Create New Gig</button>
                <button onClick={() => navigate("/mygigs")}>Manage Gigs</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;