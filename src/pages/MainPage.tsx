import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';

import AddMoneyToBalance from '../components/AddMoneyToBalance';
import Alert from '../components/Alert';
import BalanceDisplay from '../components/BalanceDisplay';
import ListOfPokemons from '../components/ListOfPokemons';
import Pocket from '../components/Pocket';
import SearchBox from '../components/SearchBox';
import { Pokemon } from '../interfaces/interfaces';

const useStyles = makeStyles({
  flexSpaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  balanceBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
});

export default function MainPage() {
  const classes = useStyles();

  const [myBalance, setMyBalance] = useState(15000);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pocket, setPocket] = useState<Pokemon[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const [searchResult, setSearchResult] = useState<Pokemon>();
  const [searchFailed, setSearchFailed] = useState(false);

  const getPokemonPrice = async (pokemonUrl: string): Promise<number> => {
    const response = await fetch(pokemonUrl);
    const pokemonObj = await response.json();

    return pokemonObj.weight * 100;
  };

  const getPokemons = useCallback(async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
    const pokemonAPIResp = await response.json();
    const pokemonsArr = pokemonAPIResp.results;

    const pokemonsWithPriceArr = await Promise.all(
      pokemonsArr.map(async (pokemon: any) => ({
        name: pokemon.name,
        price: await getPokemonPrice(pokemon.url),
      })),
    );

    return pokemonsWithPriceArr;
  }, []);

  const getPokemonByName = async (name: string): Promise<Pokemon | null> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (response.status === 200) {
      const pokemonAPIResp = await response.json();
      const pokemonSearchResult = pokemonAPIResp;

      const pokemonFound: Pokemon = {
        name: pokemonSearchResult.name,
        price: pokemonSearchResult.weight * 100,
      };
      return pokemonFound;
    }
    return null;
  };

  const buyPokemon = (pokemon: Pokemon): void => {
    if (myBalance - pokemon.price >= 0) {
      setPocket((prev) => [...prev, pokemon]);
      setMyBalance((prev) => prev - pokemon.price);
    } else {
      setAlertOpen(true);
    }
  };

  const addMoney = (amount: number): void => {
    setMyBalance((prev) => prev + amount);
  };

  useEffect(() => {
    getPokemons().then((pokemons: Pokemon[]) => setPokemonList(pokemons));
  }, [getPokemons]);

  const searchPokemon = async (pokemonName: string): Promise<void> => {
    if (pokemonName) {
      const result = await getPokemonByName(pokemonName);
      if (result == null) {
        setSearchFailed(true);
        setSearchResult(undefined);
      } else {
        setSearchResult(result);
        setSearchFailed(false);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="header">
        <SearchBox
          searchPokemon={searchPokemon}
          searchFailed={searchFailed}
          setSearchFailed={setSearchFailed}
          setSearchResult={setSearchResult}
        />
        <Typography variant="h3" align="center" component="h1" gutterBottom>
          Pokemon Shop
        </Typography>
      </Box>
      <Box component="main">
        <Box className={classes.flexSpaceAround} component="section">
          <Box className={classes.balanceBox}>
            <BalanceDisplay myBalance={myBalance} />
          </Box>
          <Box className={classes.balanceBox}>
            <AddMoneyToBalance addMoney={addMoney} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={8}>
            {!searchFailed && (
              <ListOfPokemons
                pokemonList={searchResult ? [searchResult] : pokemonList}
                buyPokemon={buyPokemon}
              />
            )}
          </Grid>
          <Grid item xs={4}>
            <Pocket pocket={pocket} />
          </Grid>
        </Grid>
      </Box>
      <Alert open={alertOpen} setOpen={setAlertOpen} />
    </Container>
  );
}
