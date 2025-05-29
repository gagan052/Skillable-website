import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { cards } from "../../data";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { search } = useLocation();
  
  // Extract category from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(search);
    const category = params.get("cat");
    if (category) {
      // Format category for display (replace underscores with spaces and capitalize)
      const formattedCategory = category
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setSelectedCategory(formattedCategory);
    } else {
      setSelectedCategory(null);
    }
  }, [search]);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search],
    queryFn: () => {
      // Initialize min and max values safely
      const min = minRef.current?.value || "";
      const max = maxRef.current?.value || "";
      
      // Create a new URLSearchParams object
      const params = new URLSearchParams();
      
      // Extract search params from the URL if they exist
      if (search) {
        // Remove the leading '?' if it exists
        const searchParams = new URLSearchParams(search.startsWith('?') ? search.substring(1) : search);
        // Copy all existing search params
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });
      }
      
      // Add min, max and sort params
      if (min) params.append("min", min);
      if (max) params.append("max", max);
      params.append("sort", sort);
      
      // Construct the final query string
      const queryStr = `/gigs?${params.toString()}`;
      
      console.log("Fetching gigs with query:", queryStr);
      
      return newRequest
        .get(queryStr)
        .then((res) => {
          return res.data;
        });
    },
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  // Find the matching card for the selected category to display its description
  const getCategoryInfo = () => {
    if (!selectedCategory) return { title: "All Categories", desc: "Explore all services available on our platform" };
    
    const matchingCard = cards.find(
      card => card.title.toLowerCase() === selectedCategory.toLowerCase()
    );
    
    return matchingCard || { 
      title: selectedCategory, 
      desc: `Explore our ${selectedCategory} services` 
    };
  };
  
  const categoryInfo = getCategoryInfo();

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">SkillAble {selectedCategory ? `- ${selectedCategory} -` : ""}</span>
        <h1>{categoryInfo.title}</h1>
        <p className="para">
          {categoryInfo.desc}
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
          ? "loading"
          : error
          ? "Something went wrong!"
          : Array.isArray(data?.gigs) && data.gigs.length > 0
          ? data.gigs.map((gig) => <GigCard key={gig._id} item={gig} />)
          : "No gigs found"}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
