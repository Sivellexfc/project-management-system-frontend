import React from "react";
import SubscriptionCard from "../components/SubscriptionCard";

const SubscriptionPage = () => {
  const descriptions_1 = [
    "Access to all premium content",
    "Unlimited storage",
    "24/7 customer support",
    "Ad-free experience",
  ];

  const descriptions_2 = [
    "Access to all premium content",
    "Unlimited storage",
    "24/7 customer support",
    "Ad-free experience",
    "24/7 customer support",
    "Ad-free experience",
  ];

  const descriptions_3 = [
    "Access to all premium content",
    "Unlimited storage",
    "24/7 customer support",
    "Ad-free experience",
    "24/7 customer support",
    "Ad-free experience",
    "24/7 customer support",
    "Ad-free experience",
  ];

  return (
    <div className="flex items-center min-h-screen justify-center">
      <div className="flex justify-between space-x-6">
        <SubscriptionCard
          title={"Regular Plan"}
          price={10}
          subTitle={"Enjoy unlimited access to all features with this plan."}
          descriptions={descriptions_1}
        />
        <SubscriptionCard
          title={"Premium Plan"}
          price={20}
          subTitle={"Enjoy unlimited access to all features with this plan."}
          descriptions={descriptions_2}
        />
        <SubscriptionCard
          title={"Pro Plan"}
          price={50}
          subTitle={"Enjoy unlimited access to all features with this plan."}
          descriptions={descriptions_3}
        />
      </div>
    </div>
  );
};

export default SubscriptionPage;
