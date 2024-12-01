import React from "react";
import person1 from "../../assets/images/person.png";
import person2 from "../../assets/images/person.png";
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const Feedback = () => {
  const feedbacks = [
    {
      id: 1,
      name: "Louis Saville",
      position: "CEO at Google inc",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: person1,
    },
    {
      id: 2,
      name: "Rekha Varadwaz",
      position: "Manager at Nike inc",
      feedback:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: person2,
    },
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">TESTIMONIALS</h2>
        <p className="text-xl text-gray-600">Client says about us</p>
      </div>
      <div className="flex flex-wrap justify-center space-x-16">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="relative max-w-md bg-white p-6 rounded-tl-[75px] rounded-br-[75px] shadow-2xl m-4 flex items-center"
          >
            <div className="absolute -left-10 top-1/2 transform -translate-y-1/2">
              <img
                src={feedback.image}
                alt={feedback.name}
                className="w-24 h-24 rounded-tl-[25px] rounded-br-[25px] border-4 border-white object-cover"
              />
            </div>
            <div className="ml-20">
              <h3 className="text-lg font-bold">{feedback.name}</h3>
              <p className="text-sm text-gray-500">{feedback.position}</p>
              <p className="mt-4 text-gray-600">{feedback.feedback}</p>
              <div className="absolute top-6 right-6 text-green-500 text-4xl">
                <FormatQuoteIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path d="M13 17h-2V7h2v10zm-1 4c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm10-19h-6.31l-.95-1H8.26l-.95 1H1v2h22V2zM2 4h20v16H2V4z" />
                </FormatQuoteIcon>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
