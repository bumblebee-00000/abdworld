import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import WhyChooseUs from '@/components/home/WhyChooseUs';

export const metadata: Metadata = {
  title: 'Why Choose Us',
  description:
    'Discover why businesses choose ABD WORLD for wholesale rice supply, consistent quality, and reliable service.',
};

export default function WhyUsPage() {
  return (
    <>
      <Navbar />
      <main>
        <WhyChooseUs />
      </main>
      <Footer />
    </>
  );
}