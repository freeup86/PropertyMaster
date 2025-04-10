import React from 'react';
import { Transaction } from '../../services/transactionService';

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <p>Date: {formatDate(transaction.date)}</p>
          <p>Amount: {formatCurrency(transaction.amount)}</p>
          <p>Category: {transaction.categoryName}</p>
          {onEditTransaction && (
            <button onClick={() => onEditTransaction(transaction)}>Edit</button>
          )}
          {onDeleteTransaction && (
            <button onClick={() => onDeleteTransaction(transaction)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;