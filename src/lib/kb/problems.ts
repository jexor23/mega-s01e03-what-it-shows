// What #4471 holds once it is read by cause, not by subject. The page explains it; this file is what runs.
// It reuses causes.ts for parser vs hint, and adds the reports the desk read as a one-day move
// (desk-notes.json): their dates are not swapped, so neither the parser nor the hint explains them.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

// Order of the table, and the GitHub issue that tracks each problem.
export const PROBLEMS: readonly { problem: Problem; title: string; issue: number | null }[] = [
  { problem: 'parser', title: 'Shared parser reads every date month first', issue: 1 },
  { problem: 'hint', title: 'booking-v3 prints MM/DD/YYYY for day-first tenants', issue: 2 },
  { problem: 'one-day', title: 'Dates move one day earlier', issue: 3 },
  { problem: 'unplaced', title: 'No tenant on file, or tenant writes month first', issue: null },
];

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'one-day';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  title: string;
  issue: number | null;
  ids: string[];
  tenants: string[];
  channels: Record<string, number>;
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

const tally = (xs: string[]) => xs.reduce<Record<string, number>>((n, x) => ({ ...n, [x]: (n[x] ?? 0) + 1 }), {});

export function splitTicket(
  rows: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
) {
  const inTicket = rows.filter((r) => r.mergedInto === ticket);
  const unique = uniqueById(inTicket);
  const groups: ProblemGroup[] = PROBLEMS.map(({ problem, title, issue }) => {
    const rs = unique.filter((r) => problemOf(r, tenantOf(r), oneDayMove) === problem);
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    return {
      problem,
      title,
      issue,
      ids: rs.map((r) => r.id).sort(),
      tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
      channels: tally(rs.map((r) => r.channel)),
      taggedAs: tally(rs.map((r) => r.meta.intakeTag)),
      firstSeen: days[0] ?? '',
      lastSeen: days[days.length - 1] ?? '',
    };
  }).filter((g) => g.ids.length > 0);
  // Intake's guess against the cause: how many reports it tagged as something they are not.
  const mistagged = unique.filter((r) => r.meta.intakeTag !== problemOf(r, tenantOf(r), oneDayMove)).length;
  return { rows: inTicket.length, unique: unique.length, groups, mistagged };
}
