import React from "react";
import {
  Badge,
  Star,
  Users,
  Gift,
  Trophy,
  BookUser,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InvestDialog from "./InvestDialog";

const TIERS = [
  {
    name: "Pit Pass",
    icon: <Badge className="h-7 w-7 text-cyan-500" aria-hidden="true" />,
    investment: "$1,000+",
    equity: "0.00010%",
    perks: [
      "Signed poster by WMC founders & mentors",
      "Exclusive investor email updates",
      "1x VIP livestream pass to first race",
      "Priority access to WMC livestream beta",
      "Early access to WMC app",
      "Official WMC T-Shirt",
    ],
    bg: "bg-cyan-50 dark:bg-gray-800/70",
    border: "border-cyan-200 dark:border-cyan-700",
    iconBg: "bg-cyan-100 dark:bg-cyan-900",
  },
  {
    name: "Grid Position",
    icon: <Users className="h-7 w-7 text-emerald-500" aria-hidden="true" />,
    investment: "$2,500+",
    equity: "0.00025%",
    perks: [
      "All previous perks",
      "Custom embroidered WMC hat",
      "1:1 onboarding call with WMC founder",
      "Behind-the-scenes production update kit",
    ],
    bg: "bg-emerald-50 dark:bg-gray-800/70",
    border: "border-emerald-200 dark:border-emerald-700",
    iconBg: "bg-emerald-100 dark:bg-emerald-900",
  },
  {
    name: "Clash Elite",
    icon: <BadgeCheck className="h-7 w-7 text-amber-400" aria-hidden="true" />,
    investment: "$5,000+",
    equity: "0.00050%",
    perks: [
      "All previous perks",
      "2x VIP tickets to any 2025 WMC event",
      'Exclusive "Investor Edition" hoodie',
    ],
    bg: "bg-amber-50 dark:bg-gray-800/70",
    border: "border-amber-200 dark:border-amber-700",
    iconBg: "bg-amber-100 dark:bg-amber-900",
  },
  {
    name: "Founding Sponsor",
    icon: <Trophy className="h-7 w-7 text-red-500" aria-hidden="true" />,
    investment: "$10,000+",
    equity: "0.00100%",
    perks: [
      "All previous perks",
      "On-site meet-and-greet with riders & crew",
      "Access to WMC garage/pit for 1 event",
    ],
    bg: "bg-red-50 dark:bg-gray-800/70",
    border: "border-red-200 dark:border-red-700",
    iconBg: "bg-red-100 dark:bg-red-900",
  },
  {
    name: "Race Team Partner",
    icon: <BookUser className="h-7 w-7 text-violet-500" aria-hidden="true" />,
    investment: "$25,000+",
    equity: "0.00250%",
    perks: [
      "All previous perks",
      "Join strategy polls for marketing/brand decisions",
      "Listed as Race Team Supporter",
    ],
    bg: "bg-violet-50 dark:bg-gray-800/70",
    border: "border-violet-200 dark:border-violet-700",
    iconBg: "bg-violet-100 dark:bg-violet-900",
  },
  {
    name: "Legend Tier",
    icon: <Gift className="h-7 w-7 text-purple-700" aria-hidden="true" />,
    investment: "$50,000+",
    equity: "0.00500%",
    perks: [
      "All previous perks",
      "Full hospitality at 2025 premiere event",
      "Lifetime VIP WMC Access Badge (all future races)",
    ],
    bg: "bg-purple-50 dark:bg-gray-800/70",
    border: "border-purple-200 dark:border-purple-700",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    highlight: true,
  },
];

const PerksSection: React.FC = () => (
  <section
    id="perks"
    className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950"
  >
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎁 Investor Perks & Tiers
      </h2>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        The higher your investment, the more rewards you unlock. All perks stack as you progress up the tiers!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-2xl border ${tier.border} shadow-md items-stretch p-6 min-h-[410px] relative
             ${tier.bg} ${tier.highlight ? "scale-105 ring-2 ring-purple-400 dark:ring-purple-700" : ""} transition-all`}
          >
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-3 ${tier.iconBg}`}
            >
              {tier.icon}
            </div>
            <div className="text-center">
              <div className="font-extrabold text-lg mb-1 text-brand-gradient">
                {tier.name}
              </div>
              <div className="font-semibold text-gray-900 dark:text-white text-2xl mb-1">
                {tier.investment}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300 mb-2 font-mono tracking-wide">
                {tier.equity} Equity
              </div>
            </div>
            <ul className="flex flex-col gap-1 text-gray-700 dark:text-gray-300 text-[0.97rem] mt-2 mb-4 px-1">
              {tier.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-block mt-2 w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full flex-shrink-0"></span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <InvestDialog
              defaultTier={tier.name}
              trigger={
                <Button
                  size="sm"
                  className={`mt-auto font-semibold w-full ${
                    tier.highlight
                      ? "bg-purple-700 hover:bg-purple-800 text-white"
                      : "bg-white/80 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  }`}
                  tabIndex={0}
                  aria-label={`Select ${tier.name}`}
                >
                  Select
                </Button>
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <InvestDialog
          trigger={
            <Button size="lg" className="bg-red-600 hover:bg-red-700 transition-colors text-white font-bold px-8 py-4 rounded-lg shadow-lg text-xl">
              Invest Now 👉
            </Button>
          }
        />
      </div>
    </div>
  </section>
);

export default PerksSection;
