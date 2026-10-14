import { GameCard, type GameCardData } from "@/components/game/GameCard";
import { cn } from "@/lib/utils";

export function GameGrid({
  games,
  className,
  priorityCount = 0,
}: {
  games: GameCardData[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4", className)}>
      {games.map((game, i) => (
        <li key={game.slug} className="[contain-intrinsic-size:auto_210px] [content-visibility:auto]">
          <GameCard game={game} priority={i < priorityCount} className="h-full" />
        </li>
      ))}
    </ul>
  );
}
