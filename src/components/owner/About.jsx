import React from "react";
// motion
import { motion } from "framer-motion";
// variants
import { fadeIn } from "./variants";
import company1 from "../../assets/images/company1.png";
import company2 from "../../assets/images/company2.png";
import company3 from "../../assets/images/company3.png";
import company4 from "../../assets/images/company4.png";
import company5 from "../../assets/images/company5.png";
import company6 from "../../assets/images/company6.png";
import company7 from "../../assets/images/company7.png";
import membership from "../../assets/images/membership.png";
import association from "../../assets/images/association.png";
import groupclub from "../../assets/images/group-club.png";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Membership Organisations",
      description:
        "Our membership management software provides full automation of membership renewals and payments",
      image: membership,
    },
    {
      id: 2,
      title: "National Associations",
      description:
        "Our membership management software provides full automation of membership renewals and payments",
      image: association,
    },
    {
      id: 3,
      title: "Clubs And Groups",
      description:
        "Our membership management software provides full automation of membership renewals and payments",
      image: groupclub,
    },
  ];

  return (
    <div className="md:px-14 px-4 py-16 max-w-screen-2xl mx-auto" id="about">
      {/* Client Logos Section */}
      {/* <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="text-center my-8"
      >
        <h2 className="text-4xl text-neutralDGrey font-semibold mb-2">
        PARTNER
        </h2>
        <p className="text-neutralGrey">
          We have been working with some Fortune 500+ clients
        </p>
        <div className="my-12 flex flex-wrap justify-between items-center gap-8">
          <img src={company1} alt="Company 1" />
          <img src={company2} alt="Company 2" />
          <img src={company3} alt="Company 3" />
          <img src={company4} alt="Company 4" />
          <img src={company5} alt="Company 5" />
          <img src={company6} alt="Company 6" />
          <img src={company7} alt="Company 7" />
        </div>
      </motion.div> */}

      {/* Service Intro Section */}
      <motion.div
        variants={fadeIn("left", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="mt-20 text-center md:w-1/2 mx-auto"
      >
        <h2 className="text-4xl text-neutralDGrey font-semibold mb-3">
        Manage your entire community in a single system
        </h2>
        <p className="text-neutralGrey">
          We have been working with some Fortune 500+ clients
        </p>
      </motion.div>

      {/* Service Cards Section */}
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="mt-14 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:w-11/12 mx-auto gap-12"
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="px-4 py-8 text-center md:w-[300px] mx-auto md:h-80 rounded-md shadow cursor-pointer hover:-translate-y-5 hover:border-b-4 hover:border-indigo-700 transition-all duration-300 flex items-center justify-center h-full"
          >
            <div>
              <div className="bg-[#E8F5E9] w-14 h-14 mx-auto mb-4 rounded-tl-3xl rounded-br-3xl">
                <img src={service.image} alt={service.title} className="-ml-5" />
              </div>
              <h4 className="text-2xl font-bold text-neutralDGrey mb-2 px-2">
                {service.title}
              </h4>
              <p className="text-sm text-neutralGrey">{service.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Services;
