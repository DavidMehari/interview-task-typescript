import {
  Box, Chip, IconButton, makeStyles, TextField,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';

type Props = {
  searchFailed: boolean;
  searchPokemon: (pokemonName: string) => void;
  setSearchFailed: React.Dispatch<React.SetStateAction<any>>;
  setSearchResult: React.Dispatch<React.SetStateAction<any>>;
};

const useStyles = makeStyles({
  centerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default function SearchBox({
  searchFailed,
  setSearchFailed,
  setSearchResult,
  searchPokemon,
}: Props) {
  const classes = useStyles();

  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText === '') {
      setSearchResult(undefined);
      setSearchFailed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <Box className={classes.centerBox}>
      <Box>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          variant="outlined"
          onChange={handleSearchChange}
          size="small"
        />
        <IconButton
          color="primary"
          aria-label="Search"
          onClick={() => searchPokemon(searchText)}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      {searchFailed && (
        <Chip
          color="secondary"
          label="There is no pokemon with that name"
          icon={<ErrorIcon />}
        />
      )}
    </Box>
  );
}
