# Uploading NHL 25 stats

This page tells a league admin how to get a sim export into the site.

## 1. Export from the sim

Export the skater and goalie stats as CSV, one file per sim run. Both kinds of row can live in
the same file: a goalie row simply fills the goalie columns and leaves the skater columns empty.

## 2. Required columns

Four columns must be present. The import refuses to run without them.

| Field | Accepted header spellings |
| --- | --- |
| `player` | player, name, playername, skater |
| `team` | team, tm, club |
| `date` | date, gamedate, gd |
| `opp` | opp, opponent, vs, against |

## 3. Optional columns

Everything else is optional. A missing column counts as zero.

| Field | Accepted header spellings |
| --- | --- |
| `gl` goals | g, goals, gl |
| `a` assists | a, assists, ast |
| `pm` plus minus | +/-, plusminus, pm |
| `pim` penalty minutes | pim, penaltyminutes |
| `sog` shots on goal | s, shots, sog, shotsongoal |
| `hit` hits | hits, hit, hts |
| `blk` blocked shots | blk, blocks, blockedshots, bs |
| `toi` time on ice | toi, timeonice |
| `fow` faceoffs won | fow, faceoffswon, fw |
| `fol` faceoffs lost | fol, faceoffslost, fl |
| `sv` saves | sv, saves |
| `ga` goals against | ga, goalsagainst |
| `sa` shots against | sa, shotsagainst |
| `so` shutouts | so, shutout, shutouts |

Header matching ignores case, spaces and punctuation, so `Shots On Goal` and `shotsongoal` are the
same column.

## 4. Formats that matter

- Write the date in a form `Date.parse` understands. `2026-01-02` is the safest.
- Write time on ice as `mm:ss` or `hh:mm:ss`.

> A bare number in the time on ice column is read as SECONDS. A column of decimal minutes imports
> wrong. Convert it to `mm:ss` before you upload.

## 5. Import the file

1. Sign in as an admin.
2. Go to `/admin/import`.
3. Choose the file and click upload.
4. Check the suggested column mapping. Fix any dropdown marked `(required)`.
5. Check the five-row preview.
6. Click import.

## 6. What the import does

- It matches teams and players by name, ignoring case. A player who plays for the team named in
  the row wins any tie.
- It finds the game by season, the two teams, and the calendar day of the date column.
- It creates the game when no fixture matches, and guesses the score from the goals in the file.
- It overwrites the stat line when the same player already has one for that game, so a corrected
  file replaces the old numbers instead of duplicating them.
- It saves the column mapping against that exact set of headers. The next upload of the same export
  format needs no mapping at all.

> Check every created game's score on `/admin/roster`. The guess is only right when the file lists
> every scorer.

## 7. Troubleshooting

| What you see | What it means | What to do |
| --- | --- | --- |
| `rows skipped` above zero | A player, team, or date in those rows did not match | Fix the name on `/admin/roster` or in the file, then upload again |
| `map the required columns` | One of the four required dropdowns is empty | Pick the matching header and import again |
| `that file has no rows` | The file has a header row and nothing else | Export again |
| `that upload expired, start again` | The stored upload is gone | Upload the file again |
| A `failed` row in the history table | The import threw | Read the error in the same row, fix the cause, upload again |

The import history sits at the bottom of `/admin/import`, and the five most recent runs also show
on `/admin`.
