
import React from 'react';
import { Gift, Star, Award, Bookmark, Ticket, Briefcase } from 'lucide-react';

const TIERS = [
  {
    name: "Bronze",
    minInvestment: "$500+",
    color: "from-orange-200 to-orange-100 dark:from-orange-700 dark:to-orange-800",
    icon: <Award className="h-7 w-7 text-amber-500" />,
    perks: [
      { text: "Welcome letter & certificate", icon: <Bookmark className="h-5 w-5 text-amber-400" /> },
      { text: "WMC digital badge & updates", icon: <Star className="h-5 w-5 text-amber-400" /> }
    ]
  },
  {
    name: "Silver",
    minInvestment: "$1,000+",
    color: "from-silver to-gray-100 dark:from-gray-500 dark:to-gray-700",
    icon: <Award className="h-7 w-7 text-silver" />,
    perks: [
      { text: "All Bronze Perks", icon: <Gift className="h-5 w-5 text-gray-400" /> },
      { text: "Limited-edition WMC hat", icon: <Briefcase className="h-5 w-5 text-gray-400" /> }
    ]
  },
  {
    name: "Gold",
    minInvestment: "$2,500+",
    color: "from-yellow-200 to-amber-100 dark:from-yellow-700 dark:to-yellow-800",
    icon: <Award className="h-7 w-7 text-yellow-500" />,
    perks: [
      { text: "All Silver Perks", icon: <Gift className="h-5 w-5 text-yellow-400" /> },
      { text: "VIP investor-only event access", icon: <Ticket className="h-5 w-5 text-yellow-400" /> },
      { text: "Early merch drops", icon: <Bookmark className="h-5 w-5 text-yellow-400" /> }
    ]
  },
  {
    name: "Platinum",
    minInvestment: "$5,000+",
    color: "from-purple-200 to-purple-100 dark:from-purple-700 dark:to-purple-900",
    icon: <Award className="h-7 w-7 text-purple-500" />,
    perks: [
      { text: "All Gold Perks", icon: <Gift className="h-5 w-5 text-purple-500" /> },
      { text: "Pit-lane walk & rider meet", icon: <Star className="h-5 w-5 text-purple-500" /> },
      { text: "Founder's call & recognition", icon: <Briefcase className="h-5 w-5 text-purple-500" /> }
    ]
  }
];

const PerksSection: React.FC = () => (
  <section id="perks" className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎁 Investor Perks & Tiers
      </h2>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Each tier unlocks new rewards as you increase your investment in World Moto Clash. All perks stack as you move up!
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br ${tier.color} relative flex flex-col items-center border border-gray-200 dark:border-gray-700`}
          >
            <div className="absolute top-3 right-3">{tier.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">{tier.name}</h3>
            <p className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{tier.minInvestment}</p>
            <ul className="space-y-3 mt-4 w-full">
              {tier.perks.map((perk, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-100">
                  {perk.icon}
                  <span className="font-medium">{perk.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <a href="#invest">
          <button className="bg-red-600 hover:bg-red-700 transition-colors text-white font-bold px-8 py-4 rounded-lg shadow-lg text-xl">
            Invest and Unlock Perks 👉
          </button>
        </a>
      </div>
    </div>
  </section>
);

export default PerksSection;
