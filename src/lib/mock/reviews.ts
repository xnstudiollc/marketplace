import type { Review, Seller } from "../types";
import { createRng } from "./rng";

const BANK = [
  "Fast delivery and friendly chat. Would buy again.",
  "Everything arrived exactly as described.",
  "Took a little longer than listed, but the seller kept me updated the whole time.",
  "Smooth trade, met me in game within five minutes.",
  "Second order with this seller, still flawless.",
  "Great communication, answered every question before I paid.",
  "Account details worked first try. Changed the email without issues.",
  "Super quick top-up, landed in under a minute.",
  "Booster was polite and finished ahead of schedule.",
  "Fair price and no surprises.",
  "Helped me pick the right server before ordering. Appreciated.",
  "Instant code, activated straight away.",
  "Exactly the rank I paid for, plus a few tips on top.",
  "Very patient while I sorted out my login.",
  "Delivered at 3 a.m. my time, no complaints at all.",
  "Good seller, slightly slow replies but delivered correctly.",
  "The coaching session was genuinely useful. Learned a lot.",
  "Items came through the mail system as promised.",
  "Clear instructions and a quick trade window.",
  "Best price I found and it actually arrived. Recommended.",
  "Bought for a friend, gift link worked perfectly.",
  "They double-checked my character name before sending. Nice touch.",
  "No issues, would recommend to my guild.",
  "Raid carry was organized and on time.",
  "Order was split into two trades but all arrived within the hour.",
  "Responsive and professional from start to finish.",
  "Subscription activated right away, no region problems.",
  "Very happy, will be back next season.",
  "Seller noticed I picked the wrong region and fixed it for me.",
  "Quick, easy and safe. Five stars.",
  "Decent experience overall, delivery a bit slower than expected.",
  "Loved the progress screenshots during the boost.",
  "Got extra currency as a thank-you for the repeat order.",
  "Straightforward and honest seller.",
  "All good, exactly as listed.",
  "Took time to explain how to secure the account. Great service.",
  "Super chill seller, instant delivery.",
  "Delivery confirmed in chat, everything matched.",
  "Would have liked faster replies, but the order was correct.",
  "My go-to seller for this game now.",
];

const NAME_A = ["pixel", "quiet", "lucky", "night", "frost", "ember", "lunar", "rapid", "mossy", "zen", "copper", "velvet"];
const NAME_B = ["rook", "otter", "comet", "sprout", "wolf", "lark", "panda", "mage", "pilot", "badger", "heron", "ghost"];

export function getSellerReviews(seller: Seller, gameNames: string[], count = 12): Review[] {
  const rng = createRng("reviews", seller.id);
  const texts = rng.shuffle(BANK);
  let day = rng.int(0, 3);
  return Array.from({ length: count }, (_, i) => {
    day += rng.int(1, 18);
    const low = seller.rating < 4.5 ? 0.25 : 0.1;
    const rating = rng.chance(low) ? rng.int(3, 4) : 5;
    return {
      id: `${seller.id}-r${i}`,
      author: `${rng.pick(NAME_A)}_${rng.pick(NAME_B)}${rng.chance(0.5) ? rng.int(1, 99) : ""}`,
      rating,
      text: texts[i % texts.length],
      gameName: gameNames.length ? rng.pick(gameNames) : "",
      daysAgo: day,
      helpful: rng.int(0, 24),
    };
  });
}

export function ratingDistribution(seller: Seller): { stars: number; share: number }[] {
  const rng = createRng("distribution", seller.id);
  const five = Math.min(0.95, Math.max(0.55, (seller.rating - 4) * 0.85 + rng.float(-0.03, 0.03)));
  const rest = 1 - five;
  const four = rest * rng.float(0.55, 0.7);
  const three = (rest - four) * 0.6;
  const two = (rest - four - three) * 0.6;
  const one = rest - four - three - two;
  return [
    { stars: 5, share: five },
    { stars: 4, share: four },
    { stars: 3, share: three },
    { stars: 2, share: two },
    { stars: 1, share: one },
  ];
}
