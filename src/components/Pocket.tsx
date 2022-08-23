import {
  Box,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';

import { MappedPocket, Pokemon } from '../interfaces/interfaces';

const useStyles = makeStyles({
  pocketListItem: {
    height: 20,
  },
  pocket: {
    border: '2px dashed lightGray',
    borderRadius: '3px',
    marginTop: '8px',
  },
});

type Props = {
  pocket: Pokemon[];
};

const countDuplicates = (pokemons: Pokemon[]) => {
  const counts: MappedPocket = {};
  pokemons.forEach((pokemon) => { counts[pokemon.name] = (counts[pokemon.name] || 0) + 1; });
  return counts;
};

export default function Pocket({ pocket }: Props) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.pocket}>
        <Typography align="center" variant="h4">
          My pocket
        </Typography>
        <List>
          {Object.entries(countDuplicates(pocket)).map((pokemon) => (
            <ListItem className={classes.pocketListItem} key={uuidv4()}>
              <ListItemText>
                {pokemon[0]}
                {pokemon[1] > 1 && ` - ${pokemon[1]}x`}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
