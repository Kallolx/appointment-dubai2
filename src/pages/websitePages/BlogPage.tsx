import AppDownloadSection from "@/components/website/AppDownloadSection";
import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import ServiceSection from "@/components/website/ServiceSection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const generalCleaning = [
  { title: "Home Cleaning", image: "./general_cleaning/homecleaning.webp" },
  {
    title: "Furniture Cleaning",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Home Deep Cleaning",
    image: "./general_cleaning/deepcleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homepageimages_furniturecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  { title: "AC Cleaning", image: "./general_cleaning/homecleaning.webp" },
];

const salonSpa = [
  { title: "Women's Salon", image: "/images/women-salon.jpg" },
  { title: "Women's Spa", image: "/images/women-spa.jpg" },
  { title: "Men's Salon", image: "/images/men-salon.jpg" },
  { title: "Men's Spa", image: "/images/men-spa.jpg" },
  { title: "Hair Salon", image: "/images/hair-salon.jpg" },
];

const BlogPage = () => {
  return (
    <>
      <NavbarForContentPage />
      <section className="max-w-7xl mx-auto md:px-4 pt-8">
        {/* Breadcrumb */}
        <nav className="md:flex gap-2 text-sm text-gray-500 mb-4 hidden ">
          <Link to={"/"} className="underline cursor-pointer text-gray-700">
            Home
          </Link>
          <ChevronRight size={20} />
          <span className="uppercase tracking-wide font-medium text-gray-700">
            Oxygen Therapy Service at Home
          </span>
        </nav>

        {/* Hero Section */}
        <div className="md:rounded-xl overflow-hidden shadow-md relative mb-8">
          <img
            src="./oxygen-therapy-home-service.webp"
            alt="Oxygen Therapy at Home"
            className="w-full h-96 md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end items-start px-4 md:px-10 pb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Oxygen Therapy Service at Home
            </h1>
            <p className="text-white text-lg mb-5">
              Now book the best oxygen therapy home service in just 60 seconds.
            </p>
            <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-yellow-300 transition w-full md:w-36">
              Book Now
            </button>
          </div>
        </div>

        <section className="px-5 md:px-0">
          {/* Content Section */}
          <section className="mt-10">
            <Link
              to={"/"}
              className="underline md:hidden cursor-pointer text-gray-700 flex items-center"
            >
              <ChevronLeft size={20} />
              Home
            </Link>
            <h2 className="text-2xl font-bold mb-6">What is Oxygen Therapy?</h2>

            <p className="text-gray-700 text-lg mb-4">
              Oxygen therapy involves the administration of supplemental oxygen
              to individuals who may have difficulty getting enough oxygen
              naturally through regular breathing. It's a medical treatment used
              to increase the amount of oxygen in the body when levels are low
              due to various health conditions or circumstances.
            </p>

            <p className="text-gray-700 text-lg mb-4">
              The therapy typically involves delivering oxygen through different
              devices, such as:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
              <li>
                <strong>Oxygen Concentrators:</strong> These devices extract
                oxygen from the air, concentrate it, and deliver it through a
                nasal cannula or mask.
              </li>
              <li>
                <strong>Oxygen Cylinders:</strong> Portable cylinders containing
                compressed oxygen can be used where mobility is necessary.
              </li>
              <li>
                <strong>Liquid Oxygen Systems:</strong> These systems store
                oxygen in a liquid form, allowing for smaller storage systems
                than compressed gas cylinders.
              </li>
            </ul>

            <p className="text-gray-700 text-lg mb-4">
              Oxygen treatment is endorsed by medical care experts and is
              utilized to treat conditions where blood oxygen levels are
              lacking; for example:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
              <li>
                <strong>Pulmonary obstructive disease (COPD):</strong>{" "}
                Conditions like emphysema and persistent bronchitis can disable
                lung capability, prompting diminished oxygen consumption.
              </li>
              <li>
                <strong>Pneumonia:</strong> Contaminations and aggravations of
                the lungs can lessen the lungs' capacity to move oxygen into the
                circulation system.
              </li>
              <li>
                <strong>Heart Conditions:</strong> Insufficient oxygen can be
                delivered to the body's tissues by certain heart diseases.
              </li>
              <li>
                <strong>Rest Apnea:</strong> During rest, stops in breathing
                decrease oxygen levels, and oxygen treatment can be utilized
                during rest to mitigate this issue.
              </li>
            </ul>

            <p className="text-gray-700 text-lg">
              The therapy aims to make more oxygen available to the body,
              improve oxygenation of tissues and organs, lessen heart strain,
              and improve well-being in general. Medical care proficiency
              decides the term and power of oxygen treatment given individual
              necessities and the fundamental condition.
            </p>
          </section>
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Can you do oxygen therapy at home?
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              Yes, you can book an oxygen therapy at home with Justlife.
              Justlife's oxygen therapy at home involves delivering and setting
              up oxygen equipment, such as oxygen concentrators or cylinders,
              directly to your residence. Trained professionals oversee the
              installation, provide instructions on usage, and ensure the
              equipment operates effectively and safely.
            </p>

            <p className="text-gray-700 text-lg">
              Justlife's at-home oxygen therapy could provide a convenient and
              comfortable solution for individuals who require supplemental
              oxygen, ensuring they receive the necessary treatment without
              frequent clinic visits.
            </p>
          </section>
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              What are the benefits of oxygen therapy?
            </h2>

            <p className="text-gray-700 text-lg mb-4">
              Oxygen treatment offers a few possible advantages for people
              encountering low oxygen levels because of different medical
              issues. A portion of the key advantages include:
            </p>

            <ul className="space-y-4 text-gray-700 text-lg">
              <li>
                <strong>Further developed Oxygenation:</strong> Oxygen therapy
                raises blood oxygen levels by making more oxygen available to
                the body. This can reduce side effects of low oxygen levels,
                like windedness, exhaustion, and instability.
              </li>
              <li>
                <strong>Improved Organ Capability:</strong> Satisfactory
                oxygenation upholds indispensable organs, guaranteeing they get
                adequate oxygen to work ideally. This can help heart capability,
                cerebrum action, and, by and large, tissue well-being.
              </li>
              <li>
                <strong>Reduced Strain on the Heart:</strong> In conditions
                where the heart has to work harder to pump blood due to low
                oxygen levels, supplemental oxygen can ease this strain by
                increasing the oxygen content in the blood, potentially
                improving heart function.
              </li>
              <li>
                <strong>Improved Exercise Tolerance:</strong> Oxygen therapy can
                enable individuals with respiratory conditions to perform
                physical activities with less difficulty by providing the
                necessary oxygen support during exertion.
              </li>
              <li>
                <strong>Abatement of Symptoms:</strong> Oxygen therapy can
                alleviate symptoms like shortness of breath, wheezing, and
                tightness in the chest for respiratory illnesses like pneumonia,
                chronic obstructive pulmonary disease (COPD), and others.
              </li>
              <li>
                <strong>Improved Rest Quality:</strong> Oxygen therapy has the
                potential to aid in the maintenance of adequate oxygen levels in
                sleep-related breathing disorders like sleep apnea, potentially
                enhancing the quality of one's sleep and reducing the
                complications that arise from sleep patterns that are
                interrupted.
              </li>
              <li>
                <strong>Advancement of Mending:</strong> Supplemental oxygen can
                help with twisted mending by guaranteeing tissues get adequate
                oxygen for the recuperating system.
              </li>
            </ul>

            <p className="text-gray-700 text-lg mt-4">
              While oxygen therapy offers these benefits, it is crucial to use
              it as healthcare professionals prescribe. Excessive oxygen levels
              can have adverse effects, and the treatment should be tailored to
              an individual's specific needs and monitored by healthcare
              providers to ensure safety and efficacy.
            </p>
          </section>
          <section className="text-gray-800 mt-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Why book Justlife's oxygen therapy at home?
            </h2>

            <p className="mb-6">
              Justlife's oxygen therapy at home may offer several advantages
              that prioritize convenience, comfort, and personalized care:
            </p>

            <ul className="space-y-4">
              <li>
                <strong className="font-semibold">Convenience:</strong> Bringing
                oxygen therapy directly to your home eliminates the need for
                frequent clinic or hospital visits, saving time and effort,
                especially for individuals with limited mobility or
                transportation challenges.
              </li>
              <li>
                <strong className="font-semibold">Comfortable Setting:</strong>{" "}
                Conducting therapy in the familiar environment of your home can
                reduce the stress often associated with medical settings,
                promoting a more relaxed experience during treatment.
              </li>
              <li>
                <strong className="font-semibold">Tailored Support:</strong>{" "}
                Justlife's services at home likely provide personalized
                attention and guidance. This can include assistance in setting
                up the equipment, instructions on usage, and ongoing support to
                address any concerns or queries related to the therapy.
              </li>
              <li>
                <strong className="font-semibold">Privacy:</strong> Home-based
                therapy ensures a higher level of privacy than clinical
                settings, which can be particularly valuable for individuals
                seeking discretion regarding their health treatments.
              </li>
              <li>
                <strong className="font-semibold">Reduced Disruptions:</strong>{" "}
                Avoiding clinic visits means no waiting rooms or potential
                exposure to illnesses in public spaces, providing a more
                controlled and safer environment for therapy.
              </li>
              <li>
                <strong className="font-semibold">
                  Professional Oversight:
                </strong>{" "}
                Justlife likely employs trained professionals to oversee the
                setup, usage, and maintenance of the equipment, ensuring proper
                functioning and adherence to safety measures.
              </li>
              <li>
                <strong className="font-semibold">Regular Monitoring:</strong>{" "}
                Professionals might conduct periodic check-ups or assessments to
                ensure the equipment's effectiveness and comfort during therapy.
              </li>
            </ul>

            <p className="mt-6">
              While these benefits can enhance the experience of oxygen therapy
              at home, it's essential to ensure that the service provider
              maintains high safety standards, employs trained professionals,
              and follows strict quality standards for effective and safe
              therapy. Consulting healthcare professionals and following their
              guidance regarding home-based oxygen therapy is essential for
              optimal results and safety.
            </p>

            <p className="mt-6">
              For more information about services we provide, kindly visit:{" "}
              <Link
                to="/body-adjustment"
                className="text-blue-600 hover:underline"
              >
                Body Adjustment at Home
              </Link>
              ,
              <Link to="/doctor" className="text-blue-600 hover:underline">
                Doctor at Home
              </Link>
              ,
              <Link to="/flu-vaccine" className="text-blue-600 hover:underline">
                Flu Vaccine at Home
              </Link>
              ,
              <Link to="/iv-therapy" className="text-blue-600 hover:underline">
                IV Therapy at Home
              </Link>
              ,{" "}
              <Link to="/lab-tests" className="text-blue-600 hover:underline">
                Lab Tests at Home
              </Link>
              ,{" "}
              <Link to="/ice-bath" className="text-blue-600 hover:underline">
                Mobile Ice Bath
              </Link>
              ,{" "}
              <Link to="/nurse" className="text-blue-600 hover:underline">
                Nurse at Home
              </Link>
              ,{" "}
              <Link to="/pcr-test" className="text-blue-600 hover:underline">
                PCR Test at Home
              </Link>
              ,{" "}
              <Link
                to="/nutritionist"
                className="text-blue-600 hover:underline"
              >
                Online Nutritionist Consultation
              </Link>
              ,{" "}
              <Link
                to="/personal-trainer"
                className="text-blue-600 hover:underline"
              >
                Personal Trainer at Home
              </Link>
              ,{" "}
              <Link
                to="/physiotherapy"
                className="text-blue-600 hover:underline"
              >
                Physiotherapy at Home
              </Link>
              ,{" "}
              <Link
                to="/psychotherapy"
                className="text-blue-600 hover:underline"
              >
                Online Psychotherapy
              </Link>
              ,{" "}
              <Link to="/vaccination" className="text-blue-600 hover:underline">
                Vaccination at Home
              </Link>
              .
            </p>
          </section>
          <p className="text-xs tracking-widest text-gray-400 uppercase mt-11">
            EVERYTHING YOU NEED
          </p>
          <ServiceSection
            heading="What other services can we help you with?"
            services={generalCleaning}
          />
          <AppDownloadSection />
        </section>
      </section>
    </>
  );
};

export default BlogPage;
