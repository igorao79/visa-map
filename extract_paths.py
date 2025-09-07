import re

# Читаем SVG файл
with open('public/map.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# Найдем все path элементы
paths = re.findall(r'<path[^>]*d="[^"]*"[^>]*/>', content, re.MULTILINE | re.DOTALL)

print(f'Найдено {len(paths)} path элементов')

# Разделим на группы по регионам (примерно)
europe_paths = paths[:50]  # Первые 50 - Европа
asia_paths = paths[50:150]  # Следующие - Азия
america_paths = paths[150:250]  # Северная Америка
south_america_paths = paths[250:300]  # Южная Америка
africa_paths = paths[300:400]  # Африка
oceania_paths = paths[400:]  # Австралия и Океания

print(f'Европа: {len(europe_paths)} стран')
print(f'Азия: {len(asia_paths)} стран')
print(f'Северная Америка: {len(america_paths)} стран')
print(f'Южная Америка: {len(south_america_paths)} стран')
print(f'Африка: {len(africa_paths)} стран')
print(f'Океания: {len(oceania_paths)} стран')

# Создадим файл с первыми странами
with open('europe_paths.txt', 'w', encoding='utf-8') as f:
    for i, path in enumerate(europe_paths[:20]):  # Первые 20 европейских стран
        f.write(f'{i+1}: {path}\n')

print('Создан файл europe_paths.txt с первыми европейскими странами')


