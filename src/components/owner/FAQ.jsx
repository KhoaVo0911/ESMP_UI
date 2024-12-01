import React, { useState } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const questions = [
    {
      id: "1",
      question: "What benefits does the ESMP management system bring to businesses?",
      answer: [
        "The ESMP management software helps store owners manage products, orders, and customers efficiently and professionally. The system allows store owners to track sales progress, manage order schedules, and check stock levels.",
        "This helps minimize errors in management and ensures that all business operations run smoothly and accurately.",
      ],
    },
    {
      id: "2",
      question: "What are the benefits of using ESMP in sales management at events?",
      answer: [
        "ESMP optimizes event sales management by providing fast, accurate, and secure payment solutions. The system synchronizes revenue and helps track sales performance in detail, allowing store owners to easily assess the effectiveness of each product and marketing campaign.",
        "Additionally, ESMP enhances the customer experience by simplifying the shopping process and providing professional customer service.",
      ],
    },
    {
      id: "3",
      question: "How does ESMP help manage orders?",
      answer: [
        "ESMP provides powerful tools to track and manage orders in a centralized and efficient way. Store owners can access the system to view order details, including customer information, delivery status, and special requests.",
        "The system also allows real-time order status updates, minimizing errors and ensuring that customers receive their orders on time.",
      ],
    },
    {
      id: "4",
      question: "How does ESMP increase sales for stores?",
      answer: [
        "ESMP helps stores promote products to consumers through online channels, allowing customers to quickly view and place orders online.",
        "The system also integrates analytics tools to optimize business strategies, reduce management costs, and increase sales efficiency. By streamlining the sales process, ESMP helps stores enhance their competitive edge and attract more customers.",
      ],
    },
    {
      id: "5",
      question: "How is the store's information protected when using ESMP?",
      answer: [
        "ESMP is committed to protecting store information with advanced security measures such as data encryption and two-factor authentication. All data about products, orders, and customers is stored on secure servers, ensuring that only authorized personnel can access it.",
        "ESMP also implements intrusion prevention and continuous monitoring to protect the system from security threats.",
      ],
    },
  ];

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center" id="faq">
      <div className="w-[89%] m-auto max-w-[1440px] bg-customHoverBg p-8 rounded-lg shadow-md">
        <h2 className="text-3xl mb-6 font-semibold">Frequently Asked Questions</h2>
        {questions.map((q) => (
          <div key={q.id} className="mb-4 last:mb-0">
            <button
              className="w-full text-left text-xl focus:outline-none p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
              onClick={() =>
                setActiveQuestion(activeQuestion === q.id ? null : q.id)
              }
            >
              {q.question}
              {activeQuestion === q.id ? <FaMinusCircle /> : <FaPlusCircle />}
            </button>
            <AnimatePresence>
              {activeQuestion === q.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2 pl-4 pr-2 text-gray-600"
                >
                  {q.answer.map((a, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {a}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
