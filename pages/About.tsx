import React from "react";
import { useSeoMeta } from "../hooks/useSeoMeta";
import { PAGE_URLS, generateLocalBusinessSchema, SITE_CONFIG } from "../lib/seo";
import AboutStorySection from "../components/about/AboutStorySection";
import AboutCertificationsSection from "../components/about/AboutCertificationsSection";

const About: React.FC = () => {
  // SEO configuration for about page
  useSeoMeta(
    {
      title: "About Prostanone - Our Story & Mission",
      description: "Learn about Prostanone's mission to provide premium, NAFDAC-certified natural prostate health solutions. Discover our commitment to quality and wellness.",
      keywords: [
        "about Prostanone",
        "company mission",
        "natural supplements",
        "prostate health brand",
        "NAFDAC certified",
        "Holis Botanical Gardens",
      ],
      url: PAGE_URLS.about,
      image: `${SITE_CONFIG.domain}/prostanone-about.jpg`,
      imageAlt: "Prostanone About Us",
      type: "website",
    },
    {
      schema: generateLocalBusinessSchema(),
    },
  );

  return (
    <div className="pt-20">
      <AboutStorySection />
      <AboutCertificationsSection />
    </div>
  );
};

export default About;
