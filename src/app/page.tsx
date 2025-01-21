import Header from "@/components/header";
import CarouselBanner from "@/components/shadcnBanner";
import Footer from '@/components/Footer'

const bannerImageLinks = [
  "/realme phone.jpg",
  "/realme phone2.jpg",
  "/samsung image.jpeg",
  "/vivo phone.jpg",
];

const HomePage = () => {
  return (
    <main>
      <Header />
      <br />
      <CarouselBanner imageLinks={bannerImageLinks} />
      <Footer />
    </main>
  );
};

export default HomePage;
