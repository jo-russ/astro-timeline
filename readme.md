# Garsc informacji:

1. "click" na timeline pokaze okno konfiguracji
2. "doubleclick" gdziekolwiek indzieje pozwoli na zmian tla
3. Ustawienia sie zapisuja w przegladarce, wiec po odpaleniu w innej zaladuja sie domyslne.
4. Grafike mozna podmienic podstawiajac inny plik timeline.png
5. events.csv - tu sa eventy. Format pliku jest nastepujacy:
```
<czas>|<Tekst do wyswietlenia>|<kolor tekstu (opcjonalny)>|<kolor tla pod tekstem (opcjonalny)>
```
Przykladowy wpis:
```
2026-07-15 15:00:00Z+0200|Bitwa pod Grunwaldem|#fff|#357
```

> **Ważne!**
> Zwroc uwage na strefe czasowa. Domyslnie zostanie uzyta strefa czasowa komputera, ale eventy mozna definiowac w innej strefie.
> Przykładowo czasy w UTC **muszš** zawierac ```Z+0000``` inaczej zostana zastosowana strefa czasowa przeglšdarki/komputera

Live site: https://jo-russ.github.io/astro-timeline/
