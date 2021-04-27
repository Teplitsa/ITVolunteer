import { ReactElement } from "react";
import HomeHero from "../home/HomeHero";
import HomeAbout from "../home/HomeAbout";
import HomeStats from "../home/HomeStats";
import HomeTop from "../home/HomeTop";
import HomeBenefits from "../home/HomeBenefits";
import HomeReviews from "../home/HomeReviews";
import HomePaseka from "../home/HomePaseka";
import HomeFounder from "../home/HomeFounder";
import HomePartners from "../home/HomePartners";
import HomeFooterCTA from "../home/HomeFooterCTA";
import HomeNews from "../home/HomeNews";
import HomeFAQ from "../home/HomeFAQ";

const Home: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeStats />
      <HomeTop />
      <HomeBenefits />
      <HomeReviews />
      <HomePaseka />
      <HomeFAQ />
      <HomeNews />
      <HomeFounder />
      <HomePartners />
      <HomeFooterCTA />
    </>
  );
};

export default Home;
