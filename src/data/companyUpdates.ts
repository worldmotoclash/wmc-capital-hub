
export interface CompanyUpdate {
  title: string;
  date: string;
  description: string;
  category: string;
}

export const companyUpdates: CompanyUpdate[] = [
  {
    title: "New Partnership Announced",
    date: "Mar 28, 2025",
    description: "We're excited to announce a strategic partnership with Pacific Media Group, enhancing our content distribution capabilities across Asia-Pacific markets.",
    category: "Partnership"
  },
  {
    title: "Q1 Earnings Report Available",
    date: "Mar 15, 2025",
    description: "The Q1 2025 earnings report is now available. Review our financial performance and key metrics for the first quarter.",
    category: "Financial"
  },
  {
    title: "New Market Expansion",
    date: "Feb 22, 2025",
    description: "WMC is expanding into European markets with new content localization efforts and strategic partnerships.",
    category: "Expansion"
  },
  {
    title: "Leadership Team Addition",
    date: "Feb 10, 2025",
    description: "We welcome Sarah Johnson as our new Chief Marketing Officer, bringing over 15 years of experience in digital media marketing.",
    category: "Team"
  },
  {
    title: "Content Production Milestone",
    date: "Jan 25, 2025",
    description: "WMC has completed production on its 500th hour of original programming, a significant milestone in our content creation journey.",
    category: "Production"
  },
  {
    title: "Technology Infrastructure Upgrade",
    date: "Jan 12, 2025",
    description: "We've completed a major upgrade to our content delivery infrastructure, improving streaming quality and reducing latency.",
    category: "Technology"
  }
];
