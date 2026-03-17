# Pokemon World

Clone tính năng trang Pokemon: list, filter theo type, phân trang. Dùng Next.js (TypeScript), 100% CSR cho trang Pokemon, filters lưu trên query string.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000), vào **Go to Pokemon list** hoặc truy cập `/pokemon`.

## Cấu trúc (modules)

- **`src/app/`** – App Router: layout, trang chủ, trang `/pokemon` (Suspense + client).
- **`src/app/api/`** – API routes (không gọi PokeAPI trực tiếp từ client):
  - `GET /api/pokemon?page=1&limit=24&types=fire,water` – list có phân trang, filter type (Promise.all + cache).
  - `GET /api/types` – danh sách types cho filter.
- **`src/lib/`** – Dùng chung: `constants`, `types/pokemon` (models), `cache` (in-memory cho API).
- **`src/modules/pokemon/`** – Module Pokemon:
  - `api/client.ts` – client gọi `/api/*`.
  - `hooks/usePokemonQuery.ts` – fetch list + types, debounce filter.
  - `components/` – LoadingOverlay, TypeFilters, PokemonCard, PokemonList, Pagination (CSS modules + Ant Design).

## Tính năng

- Tiêu đề "Welcome to Pokemon world", total items, filter theo nhiều type (query string `types=fire,flying`), giữ state khi refresh.
- List 24 item/trang: tên, ảnh (showdown front_default), số thứ tự; grid ngang.
- Phân trang: trang đầu chỉ Next, giữa có Next + Previous, trang cuối chỉ Previous.
- Loading: component loading giữa trang khi load API.
- API: list qua `/api/pokemon`, chi tiết gọi song song (Promise.all), cache từng pokemon/type; filter type gọi `/api/type/{name}` (Promise.all), merge + phân trang phía server.
- Debounce filter 300ms; constants tái sử dụng; code tách module, dễ mở rộng và bảo trì.

## Công nghệ

- Next.js 16 (App Router), TypeScript, Ant Design, CSS Modules, Tailwind.
