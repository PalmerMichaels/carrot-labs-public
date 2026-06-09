import { CLEAN_ROOM_DISCLAIMER } from "./disclaimer";
import type { RankedApplication } from "./types";

function pad(value: string, width: number): string {
  return value.length >= width ? value.slice(0, width) : value.padEnd(width, " ");
}

function truncate(value: string, width: number): string {
  return value.length <= width ? value : `${value.slice(0, width - 3)}...`;
}

export function renderTable(rankedApplications: RankedApplication[]): string {
  const rows = rankedApplications.map((ranked, index) => {
    const reasons = ranked.reasons.length > 0 ? ranked.reasons.join("; ") : "manual review recommended";
    return [
      pad(String(index + 1), 6),
      pad(truncate(ranked.application.name, 18), 20),
      pad(String(ranked.score), 7),
      pad(ranked.band, 10),
      truncate(reasons, 72)
    ].join("");
  });

  return [
    CLEAN_ROOM_DISCLAIMER,
    "",
    [pad("Rank", 6), pad("Startup", 20), pad("Score", 7), pad("Band", 10), "Why it surfaced"].join(""),
    ["----  ", "------------------  ", "-----  ", "--------  ", "----------------"].join(""),
    ...rows
  ].join("\n");
}

export function renderJson(rankedApplications: RankedApplication[]): string {
  return JSON.stringify(
    {
      disclaimer: CLEAN_ROOM_DISCLAIMER,
      generatedAt: new Date().toISOString(),
      rankedApplications
    },
    null,
    2
  );
}
