import React, { useEffect, useRef, useState } from 'react';

type Pokemon = {
  name: string;
  url: string;
};

interface PokemonResponse {
  next: string | null;
  results: Array<Pokemon>;
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

        const response = await getPokemons(url);
        setFetchRes((prev) => ({ ...response, results: [...prev.results, ...response.results] }));
      },
      { threshold: 0.5 }
    );

    scrollObserver.observe(current as Element);

    return () => {
      scrollObserver.unobserve(current as Element);
    };
  }, [fetchRes.next]);

  return (
    <section id='pokeList' ref={section}>
      {fetchRes.results.map((pokemon) => (
        <div key={pokemon.name}>{pokemon.name}</div>
      ))}
    </section>
  );
};

const getPokemons = async (url: string) => {
  const response = await fetch(url);
  return (await response.json()) as PokemonResponse;
};
