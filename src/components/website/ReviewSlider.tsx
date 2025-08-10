import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import React from "react";

type Review = {
  title: string;
  content: string;
  name: string;
  rating: number;
};

const reviews: Review[] = [
  {
    title: "Best Salon Service",
    content:
      "Super professional, clean, and overall a great service! The therapist came to my home, with everything as if I was at a Salon/Spa. She gave me a hair treatment which was quick and super good. Now, instead of dealing with traffic, etc, I will just order Justlife which is much easier since the professional will come to my place. I really loved it, and I will be booking many times again.",
    name: "Shereen",
    rating: 5,
  },
  {
    title: "Amazing Cleaning",
    content:
      "It's my first time booking with Justlife, and it exceeded my expectations. The professional cleaned our house thoroughly; she was very friendly and made sure that everything was clean before she left. It was a great experience indeed, and I will surely book another service with Justlife. ❤️",
    name: "Nadia",
    rating: 5,
  },
  {
    title: "Reliable & Professional",
    content:
      "I booked Justlife’s home lab tests for vitamin D and B12. The specialist arrived at my doorstep and took my blood sample, which was so convenient as I did not have to step out of my house. I love this app and how they provide various services and multiple home test options. It’s much more reasonable than visiting a clinic. I just love this app!",
    name: "Kareem",
    rating: 4,
  },
];

const ReviewSlider: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">
          What customers say about Justlife
        </h2>
        <p className="text-gray-600 text-lg mt-2">
          Justlife has been rated 4.8 out of 5 based on 1626 reviews as of March
          2024.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <div className="w-full max-w-4xl text-center">
                  <Card className="bg-white rounded-md border-none p-8">
                    {/* Stars outside the card */}
                    <div className="mb-4 flex justify-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 text-2xl leading-relaxed mb-6">
                      {review.content}
                    </p>
                    <p className="text-blue-500 font-bold text-lg">
                      {review.name}
                    </p>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows (floating center vertically) */}
          <CarouselPrevious className="absolute md:-left-24 md:top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md w-10 h-10 hidden md:block" />
          <CarouselNext className="absolute md:-right-24 md:top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md w-10 h-10 hidden md:block" />
        </Carousel>
      </div>
    </section>
  );
};

export default ReviewSlider;
