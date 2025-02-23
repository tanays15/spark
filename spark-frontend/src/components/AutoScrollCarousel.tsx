import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography } from "@mui/material";

// Define the type for carousel items
interface CarouselItem {
    title: string;
    text: string;
    image: string;
}

const carouselItems: CarouselItem[] = [
    { title: "What is SPARK?", text: "SPARK helps you improve speaking confidence.", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
    { title: "AI-powered Analysis", text: "We analyze tone, pitch, and speech rate.", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" },
    { title: "Track Progress", text: "Monitor improvement with analytics.", image: "https://images.squarespace-cdn.com/content/v1/60f1a490a90ed8713c41c36c/1629223610791-LCBJG5451DRKX4WOB4SP/37-design-powers-url-structure.jpeg" }
];

const AutoScrollCarousel: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        pauseOnHover: false,
        arrows: false,
        slidesToScroll: 1,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <Box sx={{ width: "100%" }}>
            {/* Explicitly ensure settings is spread correctly */}
            {React.createElement(Slider, settings,
                carouselItems.map((item, index) => (
                    <Box key={index} sx={{ textAlign: "center", p: 3 }}>
                        <Typography variant="h6" fontWeight="bold">
                            {item.title}
                        </Typography>
                        <Typography variant="body1">{item.text}</Typography>
                        <img src={item.image} alt={item.title} style={{ width: "100%", marginTop: "10px" }} />
                    </Box>
                ))
            )}
        </Box>
    );
};

export default AutoScrollCarousel;