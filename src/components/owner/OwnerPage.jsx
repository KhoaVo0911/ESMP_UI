import About from "./About"; // Corrected import
import FAQ from "./FAQ";
import MyFooter from "./Footer";
import Home from "./Home";
import Navbar from "./Navbar";
import Newsletter from "./Newsletter";
import Services from "./Services"; // Corrected import
import Blog from "./Blog";
import Feedback from "./Feedback";

const OwnerPage = () => {
  return (
    < >
      <Navbar />
      <Home />
      <Services />
      <About />
      <FAQ />
      <Feedback />
      <Newsletter />
      {/* <MyFooter /> */}
    </>
  );
}

export default OwnerPage;
