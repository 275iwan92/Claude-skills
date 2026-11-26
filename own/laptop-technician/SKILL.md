---
name: laptop-technician
description: Technician skill for Jo's Windows 11 laptop (user iwanp) - Laravel Herd sites, processes, RAM/CPU/disk, startup, temp clean-up and archiving WITHOUT destroying projects. Load before ANY clean-up, move, archive, delete, process kill, Herd change, scheduled task, or "laptop lemot/penuh" work. Written after the 2026-11-26 incident where an archive job emptied Herd\devlib2 twice.
---
# laptop-technician

## Rule zero (incident 2026-11-26 15:15)
`robocopy Temp\gpush-* D:\... /MOVE` followed the junction `vendor\jo\devlib2 -> C:\Users\iwanp\Herd\devlib2` inside old temp clones and deleted the real project (twice; a fresh restore was wiped too). Recovered only because the copy landed on D:.
- NEVER delete or move a directory before checking it for reparse points: `Get-ChildItem <dir> -Recurse -Force -Attributes ReparsePoint -ErrorAction SilentlyContinue | Select FullName,Target` (PowerShell 7), or `cmd /c dir /AL /S <dir>`.
- robocopy with /MOVE, /MOV, /MIR, /PURGE: ALWAYS add `/XJ`. Better: copy without /MOVE, verify, then delete the source.
- Delete directories with `cmd /c rd /s /q "<dir>"` (removes a junction itself, never enters it). Windows PowerShell 5.1 `Remove-Item -Recurse` and cross-drive `Move-Item` can follow junctions: do not use them on folders that may hold junctions.
- Never touch `C:\Users\iwanp\Herd\<project>` roots, `.git`, `vendor\jo\*`, `node_modules` junctions, or another session's scratchpad. Archive (copy to D:) before deleting anything; deletion of user files needs Jo's yes.
- The hook `~/.claude/hooks/herd-guard.js` denies robocopy /MOVE without /XJ, cross-drive Move-Item and deleting a Herd project root. A deny means: change the method, do not work around it.

## Herd (Laravel Herd 2.x for Windows)
- Parked folder `C:\Users\iwanp\Herd`: every subfolder is a site `http://<folder>.test` (no SSL by default; use http). Linked sites: `devlib2.test -> Herd\devlib2`, `tmmockup.test -> Herd\mockuptm`.
- CLI: `C:\Users\iwanp\.config\herd\bin\herd.bat` (on PATH in PowerShell): `herd --version`, `herd parked`, `herd links`, `herd link <name>`, `herd unlink`, `herd secure <site>`, `herd isolate <php>`, `herd php -v`, `herd restart`. Config/logs: `C:\Users\iwanp\.config\herd\` (`Log\`, `config\`).
- PHP is Herd's (8.4): `php` works in PowerShell, NOT in Git Bash (bash says "php: command not found"); run artisan/composer from PowerShell.
- Sites are slow when RAM is low (a /login can take 18 s); use `curl.exe -m 60`. A 404 for an unknown path skips web middleware, test with a real route.
- Projects: tmerp, mockuptm (tmmockup), devlib2, jays, adminku, stoku, kintai, plus work copies (adminku-b3-base, adminku-hotfix, adminku-migrasi, jays-v1, dl2base, devlib-pure, absengps). Which copy is MAIN: `~/.claude/app-main.md`. Composer path repos link `vendor\jo\devlib2` to `Herd\devlib2` with a junction, so every clone of an app (including Temp\gpush-*) points into the live DevLib2.
- Claude worktrees live in `<project>\.claude\worktrees\*`; remove them with `git worktree remove`, never by deleting folders.

## Health check (report in Indonesian, max 5 points)
- RAM/CPU: `Get-CimInstance Win32_OperatingSystem` (FreePhysicalMemory), top processes by WorkingSet; count Claude sessions, node.exe, chrome/msedge.
- Disk: `Get-PSDrive C,D,G`. Biggest folders: Temp (`gpush-*` clones), Downloads, `Herd\*\node_modules`, `storage\logs`.
- Orphans safe to stop: headless chrome/msedge with `--remote-debugging-port` whose parent process is gone; dev servers only if no session uses the port.
- Startup items: `Get-CimInstance Win32_StartupCommand`. Windows Update: `Get-WindowsUpdate` (if module) or UsoClient scan, background only.
- Scheduled task `Jo-LaptopGuard` (claude-smart\laptop-guard\guard.ps1): runs hidden, uses rd /s /q; keep it disabled unless the reparse-point check passes.

## Style
Work alone (Jo does not log in or click). Archive, never delete. Result first, max 5 points, token/time estimate for proposals; WAJIB work is done without asking.
