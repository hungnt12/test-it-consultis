/**
 * Constants dùng chung cho module Pokemon.
 * Tái sử dụng tại API routes và client.
 */

/** Base URL PokeAPI - không gọi trực tiếp từ client */
export const POKEAPI_BASE = "https://pokeapi.co/api/v2";

/** Base URL showdown sprite, có thể build URL ảnh từ id mà không cần gọi detail */
export const POKEAPI_SHOWDOWN_SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown";

/** Số item mỗi trang (theo yêu cầu) */
export const LIMIT_PER_PAGE = 24;

/** Debounce (ms) khi user thay đổi filter - tránh gọi API liên tục */
export const FILTER_DEBOUNCE_MS = 300;

/** Query param keys cho URL */
export const QUERY_PARAM_PAGE = "page";
export const QUERY_PARAM_TYPES = "types";

/** API routes nội bộ (client gọi qua đây, không gọi PokeAPI trực tiếp) */
export const API_POKEMON_PATH = "/api/pokemon";
export const API_TYPES_PATH = "/api/types";
