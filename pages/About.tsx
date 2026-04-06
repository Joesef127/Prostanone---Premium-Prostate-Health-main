import React from "react";
import { useDynamicTitle } from "../hooks/useDynamicTitle";
import AboutStorySection from "../components/about/AboutStorySection";
import AboutCertificationsSection from "../components/about/AboutCertificationsSection";

const About: React.FC = () => {
  useDynamicTitle("About Us");
  return (
    <div className="pt-20">
      <AboutStorySection />
      <AboutCertificationsSection />
    </div>
  );
};

export default About;
