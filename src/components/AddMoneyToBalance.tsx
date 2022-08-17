import { Button, TextField } from '@material-ui/core';
import { useState } from 'react';

type Props = {
  addMoney: (amount: number) => void;
};

export default function AddMoneyToBalance({ addMoney }: Props) {
  const [addMoneyAmount, setAddMoneyAmount] = useState(0);

  const handleAddMoneyAmountChange = (e: any) => {
    setAddMoneyAmount(parseInt(e.target.value, 10));
  };

  return (
    <>
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
    </>
  );
}
