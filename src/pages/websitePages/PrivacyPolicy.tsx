import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Privacy</h1>
      </div>
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm md:p-8 border border-gray-200">
        <div>
          <p className="text-gray-700 mb-4">
            We are committed to safeguarding the privacy of our website
            visitors; this policy sets out how we will treat your personal
            information. Our website uses cookies. By using our website and
            agreeing to this policy, you consent to our use of cookies in
            accordance with the terms of this policy. What information do we
            collect? We may collect, store and use the following kinds of
            personal information:
          </p>

          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              Information about your computer and about your visits to and use
              of this website (including your IP address, geographical location,
              browser type and version, operating system, referral source,
              length of visit, page views and website navigation);
            </li>
            <li>
              Information relating to any transactions carried out between you
              and us on or in relation to this website, including information
              relating to any purchases you make of our goods or services
              (including booking a cleaner through Justlife);
            </li>
            <li>
              Information that you provide to us for the purpose of registering
              with us (including your name, address and email address);
            </li>
            <li>
              Information that you provide to us for the purpose of subscribing
              to our website services, email notifications and/or newsletters
              (including your name and email address);
            </li>
            <li>Any other information that you choose to send to us; and</li>
            <li>Other information.</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Before you disclose to us the personal information of another
            person, you must obtain that person’s consent to both the disclosure
            and the processing of that personal information in accordance with
            the terms of this privacy policy.
            <br /> All credit/debit cards details and personally identifiable
            information will NOT be stored, sold, shared, rented or leased to
            any third parties.
          </p>
        </div>
        {/* Section 1: Cookies */}
        <div>
          <h2 className="font-semibold text-lg mb-2">1. Cookies</h2>
          <p className="mb-4">
            A cookie is a file containing an identifier (a string of letters and
            numbers) that is sent by a web server to a web browser and is stored
            by the browser. The identifier is then sent back to the server each
            time the browser requests a page from the server. This enables the
            web server to identify and track the web browser. We may use both
            “session” cookie and “persistent” cookies on the website. Session
            cookies will be deleted from your computer when you close your
            browser. Persistent cookies will remain stored on your computer
            until deleted, or until they reach a specified expiry date.
          </p>
          <p className="mb-4">
            We will use the session cookies to: keep track of you whilst you
            navigate the website; keep track of your bookings; prevent fraud and
            increase website security; and [other uses]. We will use the
            persistent cookies to: enable our website to recognize you when you
            visit; keep track of your preferences in relation to your use of our
            website; and other uses.
          </p>
          <p className="mb-4">
            We use Google Analytics to analyze the use of this website. Google
            Analytics generates statistical and other information about website
            use by means of cookies, which are stored on users’ computers. The
            information generated relating to our website is used to create
            reports about the use of the website. Google will store this
            information. Google’s privacy policy is available at:{" "}
            <a
              href="http://www.google.com/privacypolicy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              http://www.google.com/privacypolicy.html
            </a>
            . Our payment services providers may also send you cookies.
          </p>
        </div>

        {/* Section 2: Using Personal Info */}
        <div>
          <h2 className="font-semibold text-lg mb-2">
            2. Using your personal information
          </h2>
          <p className="mb-4">
            Personal information submitted to us via this website will be used
            for the purposes specified in this privacy policy or in relevant
            parts of the website. We may use your personal information to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>administer the website;</li>
            <li>
              improve your browsing experience by personalizing the website;
            </li>
            <li>enable your use of the services available on the website;</li>
            <li>supply to you services purchased via the website;</li>
            <li>
              send statements and invoices to you, and collect payments from
              you;
            </li>
            <li>send you general (non-marketing) commercial communications;</li>
            <li>
              send you email notifications which you have specifically
              requested;
            </li>
            <li>
              send you our newsletter and other marketing communications
              relating to our business which we think may be of interest to you,
              by post or, where you have specifically agreed to this, by email
              or similar technology (and you can inform us at any time if you no
              longer require marketing communications);
            </li>
            <li>
              deal with enquiries and complaints made by or about you relating
              to the website;
            </li>
            <li>keep the website secure and prevent fraud;</li>
            <li>
              verify compliance with the terms and conditions governing the use
              of the website (including monitoring private messages sent through
              our website private messaging service); and
            </li>
            <li>other uses.</li>
          </ul>
          <p className="my-4">
            Where you submit personal information for publication on our
            website, we will publish and otherwise use that information in
            accordance with the licence you grant to us. We will not, without
            your express consent, provide your personal information to any third
            parties for the purpose of direct marketing. All our website credit
            card financial transactions are handled through our payment services
            provider, Checkout. You can review their privacy policy at
            https://www.checkout.com/legal/privacy-policy. We will share
            information with Checkout only to the extent necessary for the
            purposes of processing payments you make via our website, refunding
            such payments and dealing with complaints and queries relating to
            such payments and refunds. Justlife will neither store any
            debit/credit card details of users nor pass any debit/credit card
            details to third parties.
          </p>
        </div>
        {/* Section 3: Disclosures */}
        <div>
          <h2 className="font-semibold text-lg mb-2">3. Disclosures</h2>
          <p className="mb-4">
            We may disclose your personal information to any of our employees,
            officers, agents, suppliers or subcontractors insofar as reasonably
            necessary for the purposes set out in this privacy policy. We may
            disclose your personal information to any member of our group of
            companies (this means our subsidiaries, our ultimate holding company
            and all its subsidiaries) insofar as reasonably necessary for the
            purposes set out in this privacy policy. In addition, we may
            disclose your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>to the extent that we are required to do so by law;</li>
            <li>
              in connection with any ongoing or prospective legal proceedings;
            </li>
            <li>
              in order to establish, exercise or defend our legal rights
              (including providing information to others for the purposes of
              fraud prevention and reducing credit risk);
            </li>
            <li>
              to any person who we reasonably believe may apply to a court or
              other competent authority for disclosure of that personal
              information where, in our reasonable opinion, such court or
              authority would be reasonably likely to order disclosure of that
              personal information.
            </li>
          </ul>
          <p className="mt-4">
            Except as provided in this privacy policy, we will not provide your
            information to third parties.
          </p>
        </div>

        {/* Section 4: International Data Transfers */}
        <div>
          <h2 className="font-semibold text-lg my-2">
            4. International data transfers
          </h2>
          <p>
            Information that we collect may be stored and processed in and
            transferred between any of the countries in which we operate in
            order to enable us to use the information in accordance with this
            privacy policy. In addition, personal information that you submit
            for publication on the website may be published on the internet and
            may be available, via the internet, around the world. We cannot
            prevent the use or misuse of such information by others. You
            expressly agree to such transfers of personal information.
          </p>
        </div>
        {/* Section 5: Security of your personal information */}
        <div>
          <h2 className="font-semibold text-lg my-2">
            5. Security of your personal information
          </h2>
          <p className="mb-2">
            We will take reasonable technical and organisational precautions to
            prevent the loss, misuse or alteration of your personal information.
            We will store all the personal information you provide on our secure
            (password- and firewall-protected) servers.
          </p>
          <p className="mb-2">
            All electronic transactions entered into via the website will be
            protected by encryption technology.
          </p>
          <p className="mb-2">
            You acknowledge that the transmission of information over the
            internet is inherently insecure, and we cannot guarantee the
            security of data sent over the internet. Justlife takes appropriate
            steps to ensure data privacy and security including through various
            hardware and software methodologies. However, Justlife cannot
            guarantee the security of any information that is disclosed online.
          </p>
        </div>

        {/* Section 6: Policy amendments */}
        <div>
          <h2 className="font-semibold text-lg mb-2">6. Policy amendments</h2>
          <p>
            We may update this privacy policy from time to time by posting a new
            version on our website. You should check this page occasionally to
            ensure you are happy with any changes. We may also notify you of
            changes to our privacy policy by email.
          </p>
        </div>

        {/* Section 7: Your rights */}
        <div>
          <h2 className="font-semibold text-lg my-2">7. Your rights</h2>
          <p className="mb-2">
            You may instruct us to provide you with any personal information we
            hold about you. Provision of such information will be subject to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>the payment of a fee (currently fixed at GBP £5); and</li>
            <li>
              the supply of appropriate evidence of your identity (for this
              purpose, we will usually accept a photocopy of your passport
              certified by a solicitor or bank plus an original copy of a
              utility bill showing your current address).
            </li>
          </ul>
          <p className="mb-2">
            We may withhold such personal information to the extent permitted by
            law. You may instruct us not to process your personal information
            for marketing purposes, by sending an email to us at{" "}
            <a
              href="mailto:wecare@justlife.com"
              className="text-blue-600 underline"
            >
              wecare@justlife.com
            </a>
            .
          </p>
          <p>
            In practice, you will usually either expressly agree in advance to
            our use of your personal information for marketing purposes, or we
            will provide you with an opportunity to opt out of the use of your
            personal information for marketing purposes.
          </p>
        </div>
        {/* Section 8: Third party websites */}
        <div>
          <h2 className="font-semibold text-lg my-2">
            8. Third party websites
          </h2>
          <p>
            The website contains links to other websites. We are not responsible
            for the privacy policies or practices of third party websites.
          </p>
        </div>

        {/* Section 9: Updating information */}
        <div>
          <h2 className="font-semibold text-lg my-2">
            9. Updating information
          </h2>
          <p>
            Please let us know if the personal information which we hold about
            you needs to be corrected or updated.
          </p>
        </div>

        {/* Section 10: Data Collection */}
        <div>
          <h2 className="font-semibold text-lg my-2">10. Data Collection</h2>
          <p>
            We collect data containing your phone number, email id, home
            address, latitude, and longitude. This information is provided to us
            when you want to make a booking. We need to contact you and find
            your location to provide home services. In case you wish to have
            this data deleted, send us an email to{" "}
            <a
              href="mailto:wecare@justlife.com"
              className="text-blue-600 underline"
            >
              wecare@justlife.com
            </a>{" "}
            requesting the data deletion.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
