import { Box } from '@mui/material';
import Header from '../../components/website/Header';
import Hero from '../../components/website/Hero';
import HowItWorks from '../../components/website/HowItWorks';
import Benefits from '../../components/website/Benefits';
import Pricing from '../../components/website/Pricing';
import Contact from '../../components/website/Contact';
import Footer from '../../components/website/Footer';

function HomePage() {
    return (
        <Box>
            <Header />
            <main>
                <Hero />
                <HowItWorks />
                <Benefits />
                <Pricing />
                <Contact />
            </main>
            <Footer />
        </Box>
    );
}

export default HomePage;