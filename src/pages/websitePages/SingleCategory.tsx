import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

type Service = {
  title: string;
  image: string;
  isNew?: boolean;
};

const categoryServices: Record<string, Service[]> = {
  "General Cleaning": [
    { title: "Home Cleaning", image: "/general_cleaning/1.webp" },
    {
      title: "Furniture Cleaning",
      image: "/general_cleaning/4.webp",
    },
    {
      title: "Home Deep Cleaning",
      image: "/general_cleaning/3.webp",
    },
    {
      title: "Kitchen & Bathroom Deep Clean",
      image: "/general_cleaning/5.webp",
    },
    {
      title: "AC Cleaning",
      image: "/general_cleaning/6.webp",
    },
    {
      title: "Laundry & Dry Cleaning",
      image: "/general_cleaning/7.webp",
    },
    {
      title: "Kitchen & Bathroom Deep Clean",
      image: "/general_cleaning/6.webp",
    },
    {
      title: "Car Wash",
      image: "/general_cleaning/8.webp",
    },
    { title: "Shoe Cleaning", image: "/general_cleaning/9.webp" },
  ],
  "Salon & Spa at Home": [
    {
      title: "Women's Salon",
      image: "/salons_and_spa/1.webp",
    },
    {
      title: "Women's Spa",
      image: "/salons_and_spa/2.webp",
    },
    {
      title: "Men's Salon",
      image: "/salons_and_spa/3.webp",
    },
    {
      title: "Hair Salon",
      image: "/salons_and_spa/4.webp",
    },
    {
      title: "Men's Spa",
      image: "/salons_and_spa/5.webp",
    },
    {
      title: "Nail Extensions",
      image: "/salons_and_spa/6.webp",
    },
    {
      title: "Lashes & Brows",
      image: "/salons_and_spa/7.webp",
    },
    {
      title: "Spray Tanning",
      image: "/salons_and_spa/8.webp",
    },
    {
      title: "Makeup",
      image: "/salons_and_spa/9.webp",
    },
  ],
  "Healthcare at Home": [
    {
      title: "Lab Tests at Home",
      image: "/healthcare_at_home/1.webp",
    },
    {
      title: "IV Therapy at Home",
      image: "/healthcare_at_home/2.webp",
    },
    {
      title: "Doctor Consultations",
      image: "/healthcare_at_home/3.webp",
    },
    {
      title: "PCR & Flu Test at Home",
      image: "/healthcare_at_home/4.webp",
    },
    {
      title: "Flu Vaccine at Home",
      image: "/healthcare_at_home/5.webp",
    },
    {
      title: "Nurse Care at Home",
      image: "/healthcare_at_home/6.webp",
    },
    {
      title: "Physiotherapy at Home",
      image: "/healthcare_at_home/7.webp",
    },
    {
      title: "Psychotherapy & Counselling",
      image: "/healthcare_at_home/8.webp",
    },
  ],
  "Handyman & Maintenance": [
    {
      title: "Handyman & Maintenance",
      image: "/general_cleaning/1.webp",
    },
    {
      title: "Home Painting",
      image: "/general_cleaning/2.webp",
    },
    {
      title: "Water Tank Cleaning",
      image: "/general_cleaning/3.webp",
    },
  ],
};

const SingleCategory = () => {
  const { category } = useParams();
  const services = categoryServices[category || ""] || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="max-w-7xl mx-auto p-4 mt-10 mb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Link to={"/"}>
          <ArrowLeft size={35} />
        </Link>
        <h2 className="text-2xl font-semibold">{category}</h2>
      </div>

      {/* Services Grid */}
      <div className="md:grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 hidden">
        {services.map((service, index) => (
          <Link
            to={`/service/${category}`}
            key={index}
            className=" min-w-[180px] overflow-hidden hover:cursor-pointer "
          >
            <div className="relative ">
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-50 object-cover rounded-md"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black rounded-md opacity-20 hover:opacity-0 transition-opacity "></div>
            </div>

            {/* Title */}
            <p className="font-bold pt-2 text-left">{service.title}</p>
          </Link>
        ))}
      </div>
      {/* Services Grid for mobile version */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
        {services.map((service, index) => (
          <Link
            to={`/service/${category}`}
            key={index}
            className="flex items-center gap-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={service.image}
              alt={service.title}
              className="w-16 h-16 rounded-md object-cover"
            />

            {/* Title */}
            <p className="font-semibold text-sm sm:text-base">
              {service.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SingleCategory;
