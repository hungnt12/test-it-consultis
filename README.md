# Pokemon World

Trang demo list Pokémon với filter theo type, phân trang.  
Tech stack: **Next.js (App Router, TypeScript, CSR 100%), Ant Design, CSS Modules, Tailwind, pokedex-promise-v2**.

---

## Cách chạy dự án

### Cài đặt & chạy dev

```bash
npm install
npm run dev
```

Mở `http://localhost:3000` – sẽ tự vào thẳng trang list `/pokemon`.

### Build production

```bash
npm run build
npm start
```

---

## Cách sử dụng trang `/pokemon`

- **Filter theo type**:
  - Danh sách type nằm ngay dưới tiêu đề.
  - Có thể chọn **nhiều type** cùng lúc.
  - Logic: chỉ hiển thị các Pokémon **có đủ tất cả type** đã chọn (intersection), không phải gộp (union).
- **Giữ trạng thái trên URL**:
  - Query string:
    - `page`: số trang (mặc định `1`).
    - `types`: danh sách type, phân tách bởi dấu phẩy. Ví dụ:  
      `/pokemon?types=fire,flying&page=2`.
  - Refresh trang hoặc share URL sẽ giữ nguyên filter + trang hiện tại.
- **Phân trang**:
  - Mỗi trang tối đa **24 items**.
  - Trang đầu: chỉ hiển thị nút **Next**.
  - Trang giữa: có **Previous** và **Next**.
  - Trang cuối: chỉ có **Previous**.
- **Loading state**:
  - Mỗi lần load data / đổi filter / đổi page sẽ hiển thị spinner (Ant Design `Spin`) ở **giữa vùng nội dung**.

---

## Cấu trúc project

- **`src/app/`**
  - `layout.tsx`: layout root, cấu hình Ant Design registry, fonts, global styles.
  - `page.tsx`: export thẳng trang `/pokemon` → vào `/` là vào list luôn.
  - `pokemon/page.tsx`: server entry, bọc `PokemonPageClient` bằng `Suspense`.
  - `pokemon/PokemonPageClient.tsx`: client component chính của trang list (CSR 100%).
  - `api/pokemon/route.ts`: API nội bộ để lấy list Pokémon (có filter + phân trang).
  - `api/types/route.ts`: API nội bộ lấy danh sách type cho filter.

- **`src/modules/pokemon/`**
  - `api/client.ts`: wrapper fetch từ client tới:
    - `GET /api/pokemon`
    - `GET /api/types`
  - `hooks/usePokemonQuery.ts`:
    - Lấy list Pokémon + list type.
    - Debounce khi đổi filter type (300ms).
    - Quản lý state `loading`, `error`.
  - `components/`:
    - `LoadingOverlay`: hiển thị spinner ở giữa trang.
    - `TypeFilters`: list type (Ant Design `Tag`), multi-select.
    - `PokemonCard`: hiển thị 1 Pokémon (tên, ảnh, số thứ tự).
    - `PokemonList`: grid các card, 24 item/trang.
    - `Pagination`: Previous/Next theo đúng rule yêu cầu.

- **`src/lib/`**
  - `constants.ts`:
    - `LIMIT_PER_PAGE` (24), `FILTER_DEBOUNCE_MS`, key query string (`page`, `types`).
    - `POKEAPI_SHOWDOWN_SPRITE_BASE` – base URL để tự build ảnh showdown từ `id`.
  - `types/pokemon.ts`: models dùng trong app (list, type, payload API).
  - `cache.ts`: in-memory cache đơn giản cho API routes (`getOrFetch`).
  - `pokedexClient.ts`: client dùng **pokedex-promise-v2**:
    - `getPokemonList(limit, offset)` – list Pokémon.
    - `getTypeByName(name)` – chi tiết 1 type (để lấy list Pokémon theo type).
    - `getTypeList()` – danh sách type.

---

## API nội bộ (backend)

### `GET /api/pokemon`

**Query params**:

- `page` (optional): số trang, mặc định `1`.
- `limit` (optional): số lượng items/trang, tối đa `24`.
- `types` (optional): danh sách type, phân tách bởi dấu phẩy.  
  Ví dụ: `types=fire,flying`.

**Behavior**:

- Nếu **không có `types`**:
  - Gọi `pokedexClient.getPokemonList(limit, offset)` để lấy list từ PokeAPI.
  - Dùng `url` trong `results` để:
    - Parse `id`.
    - Build URL ảnh showdown:  
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/{id}.gif`.

- Nếu **có `types`**:
  - Với mỗi type, gọi (và cache) `pokedexClient.getTypeByName(name)`.
  - Build map `{ name -> { url, count } }`, sau đó:
    - Chỉ giữ Pokémon có `count === số type được chọn` (intersection).
    - Áp dụng phân trang (slice theo `page`, `limit`).
    - Build `PokemonListItem` như trên.

**Response** (`ApiPokemonListPayload`):

- `count`: tổng số Pokémon match filter.
- `results`: `PokemonListItem[]`:
  - `id`: số thứ tự (id Pokémon).
  - `name`: tên.
  - `imageUrl`: URL ảnh showdown (hoặc `null` nếu không parse được).

### `GET /api/types`

- Dùng `pokedexClient.getTypeList()` để lấy danh sách type.
- Cache kết quả trong memory (`CACHE_KEY_TYPES_LIST`).
- Response (`ApiTypesPayload`):
  - `results`: `{ name: string }[]`.

---

## Lưu ý về hiệu năng

- **Giảm số lượng request**:
  - Không gọi `/pokemon/{id}` cho từng Pokémon; chỉ dùng list + build URL ảnh từ `id`.
  - Filter multiple type dùng intersection + cache từng type, tránh fetch lại toàn bộ.
- **Cache phía server (API routes)**:
  - `getOrFetch` cache:
    - `GET /type/{name}` cho mỗi type.
    - `GET /type` (danh sách type).
- **Debounce phía client**:
  - Khi user đổi filter type, gọi API sau `300ms` (giảm spam request).

---

## Hướng dẫn review / mở rộng

- Muốn đổi số item mỗi trang → chỉnh `LIMIT_PER_PAGE` trong `constants.ts`.
- Muốn thay đổi style card / grid → xem các file trong `src/modules/pokemon/components/`.
- Muốn thêm filter khác (ví dụ theo tên) → mở rộng:
  - Hook `usePokemonQuery` để nhận thêm param.
  - API `/api/pokemon` để xử lý logic filter tương ứng.
