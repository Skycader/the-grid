#!/usr/bin/env bash
> all.txt
for file in *; do
  [[ -f "$file" && "$file" != "all.txt" ]] || continue
  echo "═══════════════════════════════════════════════════════════════" >> all.txt
  echo "Файл: $file" >> all.txt
  echo "═══════════════════════════════════════════════════════════════" >> all.txt
  cat "$file" >> all.txt
  echo "" >> all.txt
done
echo "Готово. Результат записан в all.txt"
