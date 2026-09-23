import type { ExpenseEstimate } from "../data/myTripTypes";

export type ExpenseCurrencyTotal = {
  currency: string;
  amount: number;
};

export type ExpenseSummary = {
  currencyTotals: ExpenseCurrencyTotal[];
  phpTotal: number | null;
  missingPhpConversion: boolean;
};

export function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function expenseCurrency(expense: ExpenseEstimate): string {
  const currency = expense.currency?.trim().toUpperCase();
  return currency && /^[A-Z]{3}$/.test(currency) ? currency : "PHP";
}

export function expenseGroupAmount(expense: ExpenseEstimate): number | null {
  return finiteNumber(expense.amount);
}

export function expensePerPersonAmount(expense: ExpenseEstimate, travelerCount: number): number | null {
  const configured = finiteNumber(expense.perPersonAmount);
  if (configured !== null) return configured;
  const groupAmount = expenseGroupAmount(expense);
  return groupAmount !== null && Number.isFinite(travelerCount) && travelerCount > 0 ? groupAmount / travelerCount : null;
}

export function expensePhpEquivalent(expense: ExpenseEstimate): number | null {
  const configured = finiteNumber(expense.phpEquivalent);
  if (configured !== null) return configured;
  const amount = expenseGroupAmount(expense);
  const rate = finiteNumber(expense.exchangeRate?.phpPerUnit);
  return amount !== null && rate !== null ? amount * rate : null;
}

export function formatCurrencyAmount(amount: number | null | undefined, currency = "PHP"): string {
  const value = finiteNumber(amount);
  if (value === null) return "Amount to be confirmed";
  const code = /^[A-Z]{3}$/.test(currency.trim().toUpperCase()) ? currency.trim().toUpperCase() : "PHP";
  try {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${code} ${Math.round(value).toLocaleString("en-PH")}`;
  }
}

export function summarizeExpenses(expenses: ExpenseEstimate[]): ExpenseSummary {
  const totals = new Map<string, number>();
  let phpTotal = 0;
  let missingPhpConversion = false;
  for (const expense of expenses) {
    const amount = expenseGroupAmount(expense);
    if (amount !== null) {
      const currency = expenseCurrency(expense);
      totals.set(currency, (totals.get(currency) ?? 0) + amount);
    }
    const phpEquivalent = expensePhpEquivalent(expense);
    if (phpEquivalent === null) missingPhpConversion = true;
    else phpTotal += phpEquivalent;
  }
  return {
    currencyTotals: [...totals.entries()].map(([currency, amount]) => ({ currency, amount })),
    phpTotal: expenses.length > 0 && !missingPhpConversion && Number.isFinite(phpTotal) ? phpTotal : null,
    missingPhpConversion: expenses.length > 0 && missingPhpConversion,
  };
}
