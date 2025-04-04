'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EMIResult {
    EMI: number;
    totalInterest: number;
    totalRepayment: number;
    schedule: { month: number; principalPaid: number; interestPaid: number; remainingBalance: number }[];
}

// Function to Calculate EMI and Amortization Schedule
const calculateEMI = (principal: number, annualRate: number, tenure: number): EMIResult => {
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) {
        const equalEMI = principal / tenure;
        return {
            EMI: equalEMI,
            totalInterest: 0,
            totalRepayment: principal,
            schedule: Array.from({ length: tenure }, (_, i) => ({
                month: i + 1,
                principalPaid: equalEMI,
                interestPaid: 0,
                remainingBalance: principal - equalEMI * (i + 1),
            })),
        };
    }

    const EMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalRepayment = EMI * tenure;
    const totalInterest = totalRepayment - principal;

    let remainingBalance = principal;
    const schedule = [];

    for (let i = 1; i <= tenure; i++) {
        const interestPaid = remainingBalance * monthlyRate;
        const principalPaid = EMI - interestPaid;
        remainingBalance -= principalPaid;

        schedule.push({
            month: i,
            principalPaid: parseFloat(principalPaid.toFixed(2)),
            interestPaid: parseFloat(interestPaid.toFixed(2)),
            remainingBalance: parseFloat(remainingBalance.toFixed(2)),
        });
    }

    return {
        EMI: parseFloat(EMI.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalRepayment: parseFloat(totalRepayment.toFixed(2)),
        schedule,
    };
};

export default function EMICalculator() {
    const [principal, setPrincipal] = useState<number>(50000);
    const [interestRate, setInterestRate] = useState<number>(10);
    const [tenure, setTenure] = useState<number>(24);
    const [emiDetails, setEmiDetails] = useState<EMIResult | null>(null);
    const [showReport, setShowReport] = useState<boolean>(false);

    const handleCalculate = () => {
        const details: EMIResult = calculateEMI(principal, interestRate, tenure);
        setEmiDetails(details);
        setShowReport(false); // Reset report view on new calculation
    };

    return (
        <div className="grid grid-cols-2 p-5 gap-5">
            {/* Input Section */}
            <div className="col-span-1 p-5 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">EMI Calculator</h2>

                    <div className="grid gap-4">
                        <div>
                            <h3 className="text-sm font-semibold">Loan Amount</h3>
                            <Input type="number" value={principal} onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">Annual Interest Rate (%)</h3>
                            <Input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold">Loan Tenure (Months)</h3>
                            <Input type="number" value={tenure} onChange={(e) => setTenure(parseInt(e.target.value) || 0)} />
                        </div>
                        <Button onClick={handleCalculate} className="w-full mt-3">
                            Calculate EMI
                        </Button>
                    </div>
                </div>

            {/* EMI Results Section */}
            {emiDetails && (
                <div className='col-span-1 p-5 border rounded-lg'>
                        <h3 className="text-lg font-semibold mb-4">EMI Calculation Results</h3>
                        <div className='flex gap-2 items-center justify-between'>
                            <div>Monthly EMI</div>
                            <div className='text-right'>{emiDetails.EMI.toLocaleString()}</div>
                        </div>
                        <div className='flex gap-2 items-center justify-between'>
                            <div>Total Interest Payable</div>
                            <div className='text-right'>{emiDetails.totalInterest.toLocaleString()}</div>
                        </div>
                        <div className='flex gap-2 items-center justify-between'>
                            <div>Total Repayment Amount</div>
                            <div className='text-right border-t-2 border-b-2 border-gray-800'>{emiDetails.totalRepayment.toLocaleString()}</div>
                        </div>

                        {/* Show EMI Breakdown Button */}
                        <Button onClick={() => setShowReport(!showReport)} className="my-4 w-full">
                            {showReport ? "Hide EMI Report" : "View Detailed EMI Report"}
                        </Button>

                        {showReport && emiDetails && (
                <>
                    <h3 className="text-lg font-semibold mb-4">EMI Breakdown</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead className='text-right'>Principal Paid</TableHead>
                                <TableHead className='text-right'>Interest Paid</TableHead>
                                <TableHead className='text-right'>Remaining Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emiDetails.schedule.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.month}</TableCell>
                                    <TableCell className='text-right'>{row.principalPaid.toLocaleString()}</TableCell>
                                    <TableCell className='text-right'>{row.interestPaid.toLocaleString()}</TableCell>
                                    <TableCell className='text-right'>{row.remainingBalance.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}
                    </div>
            )}

            
        </div>
    );
}
