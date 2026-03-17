/**
 * Models map từ response PokeAPI sang dữ liệu dùng trong app.
 * Chỉ giữ các field cần để hiển thị.
 */

/** Item trong list (sau khi đã gọi detail) */
export interface PokemonListItem {
  id: number;
  name: string;
  imageUrl: string | null;
}

/** Response từ API list (PokeAPI) */
export interface PokeApiListResultItem {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiListResultItem[];
}

/** Response từ GET /api/v2/pokemon/{id} - chỉ dùng 2 field */
export interface PokeApiPokemonDetailResponse {
  id: number;
  sprites?: {
    other?: {
      showdown?: {
        front_default?: string | null;
      };
    };
  };
}

/** Response từ GET /api/v2/type (danh sách types) */
export interface PokeApiTypeListItem {
  name: string;
  url: string;
}

export interface PokeApiTypeListResponse {
  results: PokeApiTypeListItem[];
}

/** Response từ GET /api/v2/type/{name} - lấy danh sách pokemon theo type */
export interface PokeApiTypeDetailPokemonEntry {
  pokemon: {
    name: string;
    url: string;
  };
}

export interface PokeApiTypeDetailResponse {
  name: string;
  pokemon: PokeApiTypeDetailPokemonEntry[];
}

/** Payload trả về từ /api/pokemon (chuẩn hóa) */
export interface ApiPokemonListPayload {
  count: number;
  results: PokemonListItem[];
}

/** Payload trả về từ /api/types */
export interface ApiTypesPayload {
  results: { name: string }[];
}
