import React from "react";

type Reason = {
  icon: string;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    icon: "https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/star-lg.svg",
    title: "Top rated professionals",
    description:
      "Our professionals are reliable & well-trained, with an average rating of 4.78 out of 5!",
  },
  {
    icon: "https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/schdle_lg.svg",
    title: "Same-day availability",
    description:
      "Book in less than 60 seconds, and even select same-day slots.",
  },
  {
    icon: "https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/gph-lg.svg",
    title: "Top quality, value for money services",
    description:
      "Our professionals are equipped with the best tools and our services are always priced with you in mind.",
  },
  {
    icon: "https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/frame.svg",
    title: "Super app",
    description:
      "Being a Super app means we’ve got the widest range of home services, so we’ve got you covered!",
  },
];

const TopReasons: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20  ">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-semibold mb-2">
          There are so many reasons to love Justlife!
        </h2>
        <p className="text-gray-600">Here are the top 4!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-7xl mx-auto">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className="bg-white flex flex-col items-center rounded-xl shadow-sm px-6 py-9 text-center transition hover:shadow-md"
          >
            <img
              src={reason.icon}
              alt={reason.title}
              className="mx-auto mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{reason.title}</h3>
            <p className=" text-gray-600 hidden md:block">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopReasons;
