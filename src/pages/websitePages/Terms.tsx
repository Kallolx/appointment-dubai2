import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Terms: React.FC = () => {
  const terms = [
    "The content of the website is for the explanation and implementation of our services. It is subject to change without notice.",
    "We use cookies to monitor browsing preferences. If you allow cookies to be used, the relevant personal information may be stored by us for use by third parties.",
    "Justlife keeps the right to change, amend, cancel, or make exceptions to the terms and conditions listed here. Please check this terms and conditions page regularly for updates. Using our services, you acknowledge that you accept the terms and conditions.",
    "No partnership, joint venture, or agency is created as a result of the Terms and Conditions, and you do not have any authority of any kind to bind Justlife in any respect whatsoever.",
    "We use your content linked to our website for improving your browsing experience. If you do not want us to use your content for marketing, contact us at wecare@justlife.com.",
    "Your use of this website and any dispute arising out of such use of the website is subject to the local laws of UAE.",
    "When you book through Justlife, we will help facilitate the services for your home needs. Once the service is done, it is considered completed. We do not refund completed services. Unless prices are non-refundable licenses there is no refund on any services or time slots. Refunds can only be done on a going-forward basis. You are liable for any appointments that were missed (No Show or Late).",
    "Justlife aims to offer services within the promised time by posting them on the Justlife website from the day in which they are launched. We will not offer a refund for temporary promotions or any changes that result in the reduction of rates.",
    "We are not responsible for the conduct of the unlawful acts of service professionals/3rd party service providers and contractors.",
    "Justlife checks the backgrounds of service professionals/3rd party service providers both directly and indirectly via third-party background check services. However, each user should exercise common sense and caution to protect their personal safety and property, just like you would when faced with any person whom you do not know.",
    "Users agree to hold Justlife free from the responsibility for any damages arising or missing items during or after using the service professionals/3rd party service provider services through Justlife.",
    "Payment for services shall be made through the payment method specified on the website (e.g., a credit card or cash). If you pay any applicable charges with your credit card, we may seek pre-authorization of your credit card account prior to your purchase.",
    "If you have been given the price by your credit card, you, as the cardholder, must retain a copy of transaction records and our policies and rules.",
    "You are responsible for maintaining the confidentiality of all the information in your account.",
    "If you want to cancel your booking, you are required to give a minimum of 4 hours’ notice of cancellation. The notification must be in written format and sent to wecare@justlife.com. We reserve the right to levy a charge of up to AED 100 or any relevant administration costs.",
    "Customers using the website who are minors/under the age of 18 shall not register as a user of the website and shall not transact on or use the website.",
    "Justlife has the right to apply penalties to the home service providers for damages in the case of damage to the house or hours influencing future use or profit to the community. However, what happens to the client’s belongings and house, and interactions, is between the client and the service provider. Justlife is not responsible for what happens during or after the service once the professional leaves the house or leaving the house. Service professionals/3rd party contractors using our platform are not employees or staff of Justlife.",
    "If any provision of this Terms and Conditions is found to be unenforceable or invalid, that provision shall be limited to the minimum extent necessary so that the Terms and Conditions shall otherwise be kept in full force and effect.",
    "Justlife may transfer, assign, or delegate the Terms and Conditions and its rights and obligations without consent.",
    "Justlife will not be held liable for delay or services to OAC and subcontracted services.",
    "Justlife will send messages via WhatsApp, SMS, email, or notifications for updates and communication for the purpose of including but not limited to confirming appointments, appointment reminders, and marketing.",
    "Justlife is involved in offering home cleaning, PCR test at home, doctor at home, salon services, spa services, physiotherapy at home, lab test at home, IV therapy at home, flu vaccine at home, personal training, and online consultation. Some of these services are not licensed directly but are licensed by their authorities and subcontractors.",
    "For some healthcare, Justlife is only an aggregator of DHA-licensed healthcare facilities and does not store any medical data. All services with 3rd party services are offered under licenses by their authorities.",
    "All information regarding user medical data is private in nature and it is stored by the DHA-licensed healthcare facilities.",
    "The medical liability is entirely on the healthcare facilities. The facilities are responsible for delivering quality healthcare to the users and storing their personal medical data where applicable.",
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:items-center justify-center px-4 pb-12 pt-8">
      <NavbarForContentPage />
      <div className="md:text-center mb-6">
        <Link
          to={"/"}
          className="text-sm tracking-widest text-gray-400 uppercase"
        >
          Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Terms</h1>
      </div>
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm md:p-8 border border-gray-200">
        <div className="text-gray-800">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to Justlife’s Terms and Conditions Page.
          </h1>
          <p className="mb-6">
            By using our website and services, you agree to these Terms and
            Conditions, which, together with our Privacy Policy, govern
            Justlife’s relationship with you.
          </p>

          <ol className="list-decimal space-y-4 pl-4 ps-8">
            <li>
              “Justlife,” “we,” “us,” or “our” refer to the Justlife DMCC. The
              term “you,” “your,” “the client,” or “user” refers to the user of
              our services or the viewer of our website.
            </li>
            <li>
              The use of this website is subject to but not limited to the
              following terms of use:
            </li>
            {terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ol>
        </div>
        {/* Payment Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Method of Payment, Card Types, and Currency & Payment Information:
          </h2>
          <p className="mb-2">
            We accept payments online using Visa and MasterCard credit/debit
            cards in AED (or any other currency agreed upon).
          </p>
          <p className="mb-2">
            By saving your account as a payment instrument with Justlife, you
            are consenting to our terms of use. You may choose from various
            payment methods available on our Platform. We reserve the right to
            introduce additional payment methods or remove existing ones at our
            discretion. Online payments are processed by our third-party service
            providers, where your credit/debit card information will be stored
            for future bookings. Justlife does not store your credit/debit card
            information. Additionally, this stored information may be used for
            any future transactions, including but not limited to recurring
            appointments, outstanding payments, tips, or any other amounts due
            to Justlife.
          </p>
        </section>

        {/* Refund Policy */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Refund/Return Policy</h2>
          <p>Refunds will be done only through the Original Mode of Payment.</p>
        </section>

        {/* Quality Assurance */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Quality Assurance Program / Quality Control Policy
          </h2>
          <p className="mb-2">
            We conduct random quality inspections on a regular basis to review
            the quality of our crew members' work while they are on duty.
          </p>
          <p className="mb-2">
            Here are the three methods we use in maintaining the quality checks:
          </p>
          <ul className="list-decimal list-inside space-y-1 ml-4">
            <li>
              Unannounced Visit - To ensure service professionals are properly
              uniformed and performing their duties thoroughly and completely.
            </li>
            <li>
              On-Site Inspection - A walk-thru with the service professional
              and/or the client during regular business hours.
            </li>
            <li>
              Follow-up - A brief telephone call by our customer service agents
              after your session has been completed.
            </li>
          </ul>
        </section>

        {/* Reporting Issues */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Reporting Issues</h2>
          <p className="mb-2">
            You can report the following issues within the timeframes below:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Missing/stolen items: within 48 hours.</li>
            <li>Damaged items: within 24 hours.</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Terms;
