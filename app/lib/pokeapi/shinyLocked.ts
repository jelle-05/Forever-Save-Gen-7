// Conservatieve, initiële set USUM shiny-locked species (story / gift / event).
// Deze kunnen NOOIT shiny zijn in Ultra Sun/Moon, dus markeren we ze apart in de
// dex. De definitieve, volledige lijst komt met de legendary-catalog (Phase 6);
// de seed zet pokemon_cache.shiny_locked op basis van dezelfde set.
export const SHINY_LOCKED_IDS = new Set<number>([
  718, // Zygarde
  772, // Type: Null
  773, // Silvally
  789, // Cosmog
  790, // Cosmoem
  791, // Solgaleo
  792, // Lunala
  800, // Necrozma
  801, // Magearna
  802, // Marshadow
  803, // Poipole
  804, // Naganadel
  807, // Zeraora
])
