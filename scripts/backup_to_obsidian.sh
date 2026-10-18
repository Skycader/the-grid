#!/usr/bin/env bash
# Backup of the project as a .zip in the Obsidian vault.
#
# An extra layer of safety in case the GitHub / GitLab account is banned or lost: the Obsidian vault is
# synchronised to the clouds, the disk, flash drives and the phone.
#
# The archive is `git archive` of HEAD: exactly the committed tree, without .git. Uncommitted changes are
# NOT in it (a warning says so).
#
# Usage:   bash scripts/backup_to_obsidian.sh [--dest "<folder>"]
# Exit:    0 ok (or the commit is already backed up), 1 a failure, 2 a wrong argument.
set -euo pipefail

DEFAULT_DEST='C:\Users\Skycader\Documents\Obsidian Vault\12. Projects'
dest="$DEFAULT_DEST"

usage() {
  echo "usage: bash scripts/backup_to_obsidian.sh [--dest \"<folder>\"]" >&2
}

while [ $# -gt 0 ]; do
  case "$1" in
    --dest)
      if [ $# -lt 2 ] || [ -z "$2" ]; then
        echo "error: --dest needs a folder" >&2
        usage
        exit 2
      fi
      dest="$2"
      shift 2
      ;;
    --dest=*)
      dest="${1#--dest=}"
      if [ -z "$dest" ]; then
        echo "error: --dest needs a folder" >&2
        usage
        exit 2
      fi
      shift
      ;;
    *)
      echo "error: unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

# a Windows path (C:\...) -> a Git Bash path
if command -v cygpath >/dev/null 2>&1; then
  dest="$(cygpath -u "$dest")"
fi

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
name="$(basename "$root")"

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is not installed" >&2
  exit 1
fi
if ! git -C "$root" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: $root is not a git repository" >&2
  exit 1
fi
if ! hash="$(git -C "$root" rev-parse --short=8 HEAD 2>/dev/null)"; then
  echo "error: the repository has no commits yet" >&2
  exit 1
fi

mkdir -p "$dest"

# this commit is already backed up: nothing to do
shopt -s nullglob
existing=("$dest"/"${name}"_*_"${hash}".zip)
shopt -u nullglob
if [ ${#existing[@]} -gt 0 ]; then
  echo "backup exists: ${existing[0]} (commit $hash), nothing to do"
  exit 0
fi

if [ -n "$(git -C "$root" status --porcelain)" ]; then
  echo "warning: there are uncommitted changes; they are NOT in the archive (it is exactly the commit $hash)" >&2
fi

stamp="$(date +%Y-%m-%d_%H%M)"
out="$dest/${name}_${stamp}_${hash}.zip"
tmp="$out.partial"
trap 'rm -f -- "$tmp"' EXIT

git -C "$root" archive --format=zip --prefix="${name}/" -o "$tmp" HEAD

if [ ! -s "$tmp" ]; then
  echo "error: git archive produced an empty file" >&2
  exit 1
fi
mv -- "$tmp" "$out"

bytes="$(wc -c < "$out" | tr -d '[:space:]')"
if [ "$bytes" -ge 1048576 ]; then
  size="$(awk -v b="$bytes" 'BEGIN { printf "%.1f MB", b / 1048576 }')"
else
  size="$(awk -v b="$bytes" 'BEGIN { printf "%.1f KB", b / 1024 }')"
fi
shown="$out"
if command -v cygpath >/dev/null 2>&1; then
  shown="$(cygpath -w "$out")"
fi
echo "backup OK: $shown ($size, commit $hash)"
