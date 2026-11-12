// Government subsidy for ZeniTEK solar tunnel dryers, from ZeniTEK's subsidy sheets
// ("Model & cost details, as per the rates fixed by the Government A.E.D." and "Optional items &
// subsidy calculation example"). Every figure on the Subsidies page is calculated from these values;
// they reproduce the sheets' tables exactly (40% amounts rounded to the rupee, as on the sheets).

// Who gets how much: a share of the total cost, but never more than the maximum (whichever is lower)
export const SUBSIDY_CATEGORIES = [
  { id: 'priority', percent: 50, max: 440000, whoKey: 'sub_who50' },   // SC / ST, small & marginal, women farmers
  { id: 'other', percent: 40, max: 352000, whoKey: 'sub_who40' },      // other farmers
];

// The five tunnel dryer sizes (20 ft wide) with the A.E.D. rate per sq.ft, and the trolleys and SS
// trays suggested with each (they bring every size to about ₹8.78 lakh, close to the 50% maximum)
export const TUNNEL_MODELS = [
  { n: 1, width: 20, length: 21, rate: 830, trolleys: 24, trays: 143 },
  { n: 2, width: 20, length: 28, rate: 830, trolleys: 19, trays: 111 },
  { n: 3, width: 20, length: 35, rate: 778, trolleys: 15, trays: 90 },
  { n: 4, width: 20, length: 42, rate: 752, trolleys: 11, trays: 67 },
  { n: 5, width: 20, length: 49, rate: 752, trolleys: 6, trays: 39 },
].map(m => ({ ...m, area: m.width * m.length }));

// Optional items, available at the subsidised price
export const PRICES = {
  tray: 2832,      // SS tray 20" × 28" × 1.75" (3.8 sq.ft), each
  trolley: 5200,   // trolley 60" × 28" × 36", holds 6 trays, each
  combo: 22192,    // 6 trays + 1 trolley
  heater: 10620,   // per kW
};

export const subsidyFor = (total, category) => Math.min(Math.round((total * category.percent) / 100), category.max);

// Cost, subsidy and farmer's share for a size with the given optional items
export function estimate(model, category, { trolleys = 0, trays = 0, heaterKw = 0 } = {}) {
  const dryer = model.area * model.rate;
  const items = trolleys * PRICES.trolley + trays * PRICES.tray + heaterKw * PRICES.heater;
  const total = dryer + items;
  const subsidy = subsidyFor(total, category);
  return { dryer, total, subsidy, share: total - subsidy, capped: subsidy === category.max && (total * category.percent) / 100 > category.max };
}

// Indian digit grouping: 878376 -> "₹8,78,376"
export const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const num = (n) => Math.round(n).toLocaleString('en-IN');
