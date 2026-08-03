import React, { useEffect } from 'react';
import PortfolioLayout from '../components/portfolio/PortfolioLayout';
import PortfolioHero from '../components/portfolio/PortfolioHero';
import PortfolioAbout from '../components/portfolio/PortfolioAbout';
import PortfolioSkills from '../components/portfolio/PortfolioSkills';
import PortfolioProjects from '../components/portfolio/PortfolioProjects';
import PortfolioMotionGraphics from '../components/portfolio/PortfolioMotionGraphics';
import PortfolioVideoEditing from '../components/portfolio/PortfolioVideoEditing';
import PortfolioVFX from '../components/portfolio/PortfolioVFX';
import PortfolioAIProjects from '../components/portfolio/PortfolioAIProjects';
import PortfolioCertificates from '../components/portfolio/PortfolioCertificates';
import PortfolioResume from '../components/portfolio/PortfolioResume';
import PortfolioContact from '../components/portfolio/PortfolioContact';

export default function PortfolioPage({ navigate }) {

  useEffect(() => {
    // Set dynamic page metadata for SEO
    document.title = "Vansh Hemanshu Shah | Creative Developer & AI Portfolio";

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Creative Developer specializing in Frontend Development, Motion Graphics, Video Editing, VFX, AI Applications, and Web Engineering.');
    }

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <PortfolioLayout navigate={navigate}>
      <PortfolioHero />
      <PortfolioAbout />
      <PortfolioSkills />
      <PortfolioProjects />
      <PortfolioMotionGraphics />
      <PortfolioVideoEditing />
      <PortfolioVFX />
      <PortfolioAIProjects />
      <PortfolioCertificates />
      <PortfolioResume />
      <PortfolioContact />
    </PortfolioLayout>
  );
}
