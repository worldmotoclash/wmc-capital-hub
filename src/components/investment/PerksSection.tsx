
import React from "react";
import { Award, Badge, Star, Diamond } from "lucide-react";

const TIERS = [
  {
    name: "Tier 1",
    icon: <Award className="h-6 w-6 text-cyan-400" aria-hidden="true" />,
    price: "$600",
    subtitle: "Investors who invest at least $600+ will receive the following:",
    perks: [
      "Early Access to new Fanbase features on the platform.*"
    ],
    highlight: false,
    bg: "bg-white/90 dark:bg-gray-800"
  },
  {
    name: "Tier 2",
    icon: <Badge className="h-6 w-6 text-sky-500" aria-hidden="true" />,
    price: "$1,000",
    subtitle: "Investors who invest at least $1,000+ will receive the following:",
    perks: [
      "Early Access to new Fanbase features on the platform.*",
      "10,000 loves to use on Fanbase.",
      "A verified profile badge.",
    ],
    highlight: false,
    bg: "bg-white/90 dark:bg-gray-800"
  },
  {
    name: "Tier 3",
    icon: <Badge className="h-6 w-6 text-emerald-500" aria-hidden="true" />,
    price: "$2,500",
    subtitle: "Investors who invest at least $2,500+ will receive the following:",
    perks: [
      "Early Access to new Fanbase features on the platform.*",
      "15,000 loves to use on Fanbase.",
      "A Fanbase T-Shirt.",
      "A verified profile badge.",
    ],
    highlight: false,
    bg: "bg-white/90 dark:bg-gray-800"
  },
  {
    name: "Tier 4",
    icon: <Star className="h-6 w-6 text-amber-400" aria-hidden="true" />,
    price: "$5,000",
    subtitle: "Investors who invest at least $5,000+ will receive the following:",
    perks: [
      "Early Access to new Fanbase features on the platform.*",
      "20,000 loves to use on Fanbase.",
      "Fanbase T-Shirt.",
      "Early investor gold verified profile badge.",
      "5% Bonus Shares."
    ],
    highlight: false,
    bg: "bg-white/90 dark:bg-gray-800"
  },
  {
    name: "Tier 5",
    icon: <Diamond className="h-6 w-6 text-purple-400" aria-hidden="true" />,
    price: "$10,000",
    subtitle: "Investors who invest at least $10,000+ will receive the following:",
    perks: [
      "Early Access to new Fanbase features on the platform.*",
      "30,000 loves to use on Fanbase.",
      "Fanbase T-Shirt.",
      "Early investor gold verified profile badge.",
      "Access to a private dinner for Diamond level investors."
    ],
    highlight: false,
    bg: "bg-white/90 dark:bg-gray-800"
  }
];

const PerksSection: React.FC = () => (
  <section id="perks" className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎁 Investor Perks & Tiers
      </h2>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        Unlock more rewards as your investment grows. All investment perks stack!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {/* Tiers 1-5 */}
        {TIERS.map((tier, idx) => (
          <div key={tier.name}
               className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md items-stretch p-6 bg-white/90 dark:bg-gray-800 min-h-[320px] relative">
            <div className="flex items-center gap-2 mb-3">
              {tier.icon}
              <span className="text-2xl font-extrabold text-gray-800 dark:text-white">{tier.price}</span>
            </div>
            <div className="text-base font-bold text-brand-gradient mb-1">{tier.name}</div>
            <div className="text-gray-700 dark:text-gray-200 font-semibold text-sm mb-2">{tier.subtitle}</div>
            <ul className="flex flex-col gap-1 text-gray-600 dark:text-gray-300 text-[0.96rem] mb-4">
              {tier.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full"></span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-auto border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800 font-semibold rounded-lg py-2 w-full text-gray-900 dark:text-gray-100 text-base transition hover:bg-gray-50 dark:hover:bg-gray-700"
              tabIndex={0}
              aria-label={`Select ${tier.name}`}
            >
              Select
            </button>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a href="#invest">
          <button className="bg-red-600 hover:bg-red-700 transition-colors text-white font-bold px-8 py-4 rounded-lg shadow-lg text-xl">
            Invest and Unlock Perks 👉
          </button>
        </a>
      </div>
      {/* For demonstration purposes, use a footnote for asterisk */}
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
        *Fanbase feature access is subject to rollout schedule.
      </p>
    </div>
  </section>
);

export default PerksSection;
