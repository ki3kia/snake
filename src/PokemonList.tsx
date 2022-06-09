import React, { useEffect, useRef, useState } from 'react';

type Pokemon = {
  name: string;
  url: string;
  id?: number;
};

interface PokemonResponse {
  next: string | null;
  results: Array<Pokemon>;
}

function isPokemonRes(arg: unknown): arg is PokemonResponse {
  if (!arg && typeof arg !== 'object') return false;
  return 'next' in (arg as PokemonResponse) && 'results' in (arg as PokemonResponse);
}

function isPokemon(arg: unknown): arg is Pokemon {
  if (!arg && typeof arg !== 'object') return false;
  if ('name' in (arg as Pokemon) && 'url' in (arg as Pokemon)) {
    return true;
  }
  return false;
}

export const PokemonList = (): JSX.Element => {
  const section = useRef<HTMLElement>(null);
  const limit = 10;

  const [fetchRes, setFetchRes] = useState<PokemonResponse>({
    next: `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${limit}`,
    results: [],
  });

  useEffect(() => {
    if (!section.current || !fetchRes.next) return;

    const current = section.current.lastChild ?? section.current;

    const url = fetchRes.next;

    const scrollObserver = new IntersectionObserver(
      async ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        if (!entry.isIntersecting) return;

        observer.unobserve(current as Element);

        const responseList = await getPokemons(url);

        setFetchRes((prev) => {
          return isPokemonRes(responseList)
            ? {
                ...responseList,
                results: [...prev.results, ...responseList.results],
              }
            : prev;
        });
      },
      { threshold: 0.5 }
    );

    scrollObserver.observe(current as Element);

    return () => {
      scrollObserver.unobserve(current as Element);
    };
  }, [fetchRes.next]);

  return (
    <section id='pokeList' className='pokemonList' ref={section}>
      {fetchRes.results.map((pokemon, key) => (
        <div key={pokemon.name}>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
              key + 1
            }.svg`}
          />
          <div className='pokemonInfo'>{pokemon.name}</div>
        </div>
      ))}
    </section>
  );
};

const getPokemons = async (url: string): Promise<PokemonResponse | Pokemon | null> => {
  const response = await fetch(url);
  const data: unknown = await response.json();

  return isPokemonRes(data) || isPokemon(data) ? data : null;
};
