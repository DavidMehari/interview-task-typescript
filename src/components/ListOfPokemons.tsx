import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

import { Pokemon } from '../interfaces/interfaces';

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
});

type Props = {
  pokemonList: Pokemon[];
  buyPokemon: (pokemon: Pokemon) => void;
};

export default function ListOfPokemons({ pokemonList, buyPokemon }: Props) {
  const classes = useStyles();

  return (
    <List>
      {pokemonList.map((pokemon: any) => (
        <ListItem className={classes.listItem} key={pokemon.name}>
          <ListItemText primary={pokemon.name} />
          <ListItemText primary={pokemon.price} />
          <ListItemSecondaryAction>
            <Button variant="contained" onClick={() => buyPokemon(pokemon)}>
              BUY
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
