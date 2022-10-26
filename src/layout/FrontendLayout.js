import Navigation from "../components/frontend/Nav";
import Footer from "../components/frontend/Footer";

const FrontendLayout = ({ children }) => {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default FrontendLayout;
