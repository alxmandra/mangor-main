import React from "react";
import { MangorCarousel } from "../components/carousel/carousel";

export const Home = () => {
  return (
    <div className="container pt-5">
      <div className="row">
        <h1>Home</h1>
      </div>
      <div className="container">
        <div className="row" >
          <MangorCarousel />
        </div>
      </div>
    </div>

  );
}
