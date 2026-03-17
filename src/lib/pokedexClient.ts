import Pokedex from "pokedex-promise-v2";

const P = new Pokedex({
  protocol: "https",
  hostName: "pokeapi.co",
  versionPath: "/api/v2/",
});

export const pokedexClient = {
  getPokemonList(limit: number, offset: number) {
    return P.getPokemonsList({ limit, offset });
  },
  getTypeByName(name: string) {
    return P.getTypeByName(name);
  },
  getTypeList() {
    return P.getTypesList();
  },
};

