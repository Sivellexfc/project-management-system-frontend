import React from "react";

const SubscriptionCard = ({ title, price, subTitle, descriptions = [] }) => {
  return (
    <div
      className="h-[32rem] w-[16rem] bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl 
      transition-all duration-300 max-w-sm my-auto flex flex-col flex-grow justify-between"
    >
      
      <div>
        {/* Header */}
        <div className="text-xl font-semibold text-gray-800 mb-4">{title}</div>

        {/* Price */}
        <div className="text-3xl font-bold text-black-600 mb-4">${price}</div>

        {/* Description */}
        <div className="text-gray-600 mb-6">{subTitle}</div>

        {/* Features List */}
        <div className="flex flex-col space-y-3">
          <ul className="list-disc list-inside text-gray-700">
            {descriptions.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <button className="bg-secondary text-black w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
