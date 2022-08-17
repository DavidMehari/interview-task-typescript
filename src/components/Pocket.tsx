import {
  Box,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';

import { Pokemon } from '../interfaces/interfaces';

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

export default function Pocket({ pocket }: Props) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.pocket}>
        <Typography align="center" variant="h4">
          My pocket
        </Typography>
        <List>
          {pocket.map((pokemon: any, i: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem className={classes.pocketListItem} key={i}>
              <ListItemText primary={`- ${pokemon.name}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
