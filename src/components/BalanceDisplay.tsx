import { Chip, Typography } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

type Props = {
  myBalance: number
};

export default function BalanceDisplay({ myBalance }: Props) {
  return (
    <>
      <Typography variant="body1" align="center" component="div">
        {`Balance: ${myBalance}`}
      </Typography>
      {myBalance < 2000 && (
        <Chip color="secondary" label="LOW MONEY" icon={<ErrorIcon />} />
      )}
    </>
  );
}
