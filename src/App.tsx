import './App.css';
import './pokemon.css';
import { Pokemon, PokemonList } from './PokemonList';
import { useState } from 'react';

function App(): JSX.Element {
  const [pokemon, setPokemon] = useState<Pokemon['id']>(0);

  return (
    <div className='App'>
      <PokemonList pokemonId={pokemon} onSelectPokemon={setPokemon} />
      <button key='next'>Next</button>
    </div>
  );
}

export default App;
