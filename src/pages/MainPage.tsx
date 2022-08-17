import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

import AddMoneyToBalance from '../components/AddMoneyToBalance';
import Alert from '../components/Alert';
import BalanceDisplay from '../components/BalanceDisplay';
import ListOfPokemons from '../components/ListOfPokemons';
import Pocket from '../components/Pocket';
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

  const getPokemonPrice = async (pokemonUrl: string): Promise<number> => {
    const response = await fetch(pokemonUrl);
    const pokemonObj = await response.json();

    return pokemonObj.weight * 100;
  };

  const getPokemons = async () => {
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
  };

  const buyPokemon = (pokemon: Pokemon) => {
    if (myBalance - pokemon.price >= 0) {
      setPocket((prev: Pokemon[]) => [...prev, pokemon]);
      setMyBalance((prev) => prev - pokemon.price);
    } else {
      setAlertOpen(true);
    }
  };

  const addMoney = (amount: number) => {
    setMyBalance((prev) => prev + amount);
  };

  useEffect(() => {
    getPokemons().then((pokemons: Pokemon[]) => setPokemonList(pokemons));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h3" align="center" component="h1" gutterBottom>
          Pokemon Shop
        </Typography>
        <Box className={classes.flexSpaceAround}>
          <Box className={classes.balanceBox}>
            <BalanceDisplay myBalance={myBalance} />
          </Box>
          <Box className={classes.balanceBox}>
            <AddMoneyToBalance addMoney={addMoney} />
          </Box>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <ListOfPokemons pokemonList={pokemonList} buyPokemon={buyPokemon} />
        </Grid>
        <Grid item xs={4}>
          <Pocket pocket={pocket} />
        </Grid>
      </Grid>
      <Alert open={alertOpen} setOpen={setAlertOpen} />
    </Container>
  );
}

/* Questions:
  - are pokemons unique (can I buy 2 with the same name?)
  - add money only positive
*/
