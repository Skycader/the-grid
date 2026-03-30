# Используем расширенный поиск (только ex + цифры + .js)
for file in ex[0-9]*.js; do
    # Пропускаем файлы, если в имени есть 'sol' или 'spec'
    [[ "$file" == *".sol.js" || "$file" == *".spec.js" ]] && continue
    
    # Проверяем наличие файла
    [ -e "$file" ] || continue
    
    echo "--- File: $file ---" >> Info.txt
    head -n 10 "$file" >> Info.txt
    echo -e "\n" >> Info.txt
done