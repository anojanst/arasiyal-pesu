export interface Budget {
    id: number
    name: string
    amount: number
    icon: string | null
    createdBy: string
    tagCount: number
    totalSpent: number
    expenseCount: number
}

export interface Tag {
    id: number
    name: string
    createdBy: string
    totalSpent: number
    expenseCount: number
}

export interface Expense {
    id: number,
    name: string,
    amount: number,
    createdBy: string,
    date: string,
    tagId: number | null,
    tagName: string
}

export interface Income {
    id: number,
    name: string,
    amount: number,
    createdBy: string,
    date: string,
    category: string
}

export interface Loan {
    id: number;
    createdBy: string;
    lender: string;
    principalAmount: number;
    interestRate: string;
    tenureMonths: number;
    repaymentFrequency: string;
    EMI: number;
    remainingPrincipal: number;
    nextDueDate: string;
    isPaidOff: boolean;
  }
  

  export interface LoanRepayment {
    id: number;
    loanId: number | null;
    createdBy: string;
    scheduledDate: string; // Format: YYYY-MM-DD
    amount: number;
    principalAmount: number;
    interestAmount: number;
    status: string;
  }
  