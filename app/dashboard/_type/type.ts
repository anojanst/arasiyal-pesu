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
    date: string
}