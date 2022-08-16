import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
  listItem: {
    background: '#a5a5a5',
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '0px 0px 10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  pocketListItem: {
    height: 20,
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  flexSpaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  addMoneyBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  pocket: {
    border: '2px dashed lightGray',
    borderRadius: '3px',
    marginTop: '8px',
  },
});

interface Pokemon {
  name: string;
  price: number;
}

export default function MainPage() {
  const classes = useStyles();

  const [myBalance, setMyBalance] = useState(15000);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pocket, setPocket] = useState<Pokemon[]>([]);
  const [addMoneyAmount, setAddMoneyAmount] = useState(0);

  const getPokemonPrice = async (pokemonUrl: string): Promise<number> => {
    const response = await fetch(pokemonUrl);
    const pokemonObj = await response.json();

    return pokemonObj.weight * 100;
  };

  const fetchPokemons = async () => {
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
    setPocket((prev: Pokemon[]) => [...prev, pokemon]);
    setMyBalance((prev) => prev - pokemon.price);
  };

  const addMoney = (amount: number) => {
    setMyBalance((prev) => prev + amount);
  };

  const handleAddMoneyAmountChange = (e: any) => {
    setAddMoneyAmount(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    fetchPokemons().then((pokemons: Pokemon[]) => setPokemonList(pokemons));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(pocket);

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h3" align="center" component="h1" gutterBottom>
          Pokemon Shop
        </Typography>
        <Box className={classes.flexSpaceAround}>
          <Box className={classes.addMoneyBox}>
            <Typography variant="body1" align="center" component="div">
              {`Balance: ${myBalance}`}
            </Typography>
            {myBalance < 2000 && (
              <Chip color="secondary" label="LOW MONEY" icon={<ErrorIcon />} />
            )}
          </Box>
          <Box className={classes.addMoneyBox}>
            <TextField
              id="add-money-amount"
              label="Add money to your balance"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={addMoneyAmount}
              onChange={handleAddMoneyAmountChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => addMoney(addMoneyAmount)}
            >
              Add money
            </Button>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <List>
            {pokemonList.map((pokemon: any) => (
              <ListItem className={classes.listItem}>
                <ListItemText primary={pokemon.name} />
                <ListItemText primary={pokemon.price} />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    onClick={() => buyPokemon(pokemon)}
                  >
                    BUY
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={4}>
          <Box className={classes.pocket}>
            <Typography align="center" variant="h4">My pocket</Typography>
            <List>
              {pocket.map((pokemon: any) => (
                <ListItem className={classes.pocketListItem}>
                  <ListItemText primary={`- ${pokemon.name}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

/* Questions:
  - are pokemons unique (can I buy 2 with the same name?)
  - balance can go to minus?
*/
