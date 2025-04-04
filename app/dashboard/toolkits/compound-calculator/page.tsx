'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CompoundResult {
    finalAmount: number;
    totalInterest: number;
    schedule: { month: number; total: number; interest: number }[];
}

const calculateCompoundInterest = (
    principal: number,
    rate: number,
    years: number,
    frequency: number,
    monthlyContribution: number
): CompoundResult => {
    const r = rate / 100;
    const n = frequency;

    let balance = principal;
    const schedule: { month: number; total: number; interest: number }[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= years * 12; i++) {
        let interestEarned = balance * (r / n);
        balance += interestEarned;
        balance += monthlyContribution;
        totalInterest += interestEarned;

        if (i % 12 === 0) {
            schedule.push({
                month: i,
                total: parseFloat(balance.toFixed(2)),
                interest: parseFloat(totalInterest.toFixed(2))
            });
        }
    }

    return {
        finalAmount: parseFloat(balance.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        schedule,
    };
};

export default function CompoundCalculator() {
    const [principal, setPrincipal] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(5);
    const [years, setYears] = useState<number>(10);
    const [compounding, setCompounding] = useState<string>('12');
    const [monthlyContribution, setMonthlyContribution] = useState<number>(100);
    const [result, setResult] = useState<CompoundResult | null>(null);
    const [showSchedule, setShowSchedule] = useState<boolean>(false);

    const handleCalculate = () => {
        const frequency = parseInt(compounding, 10);
        const details = calculateCompoundInterest(principal, interestRate, years, frequency, monthlyContribution);
        setResult(details);
        setShowSchedule(false);
    };

    return (
        <div className="flex p-5 gap-5">
            <div className="w-1/2 p-5 border shadow-sm rounded-lg">

                <h2 className="text-lg font-semibold mb-4">Compound Interest Calculator</h2>

                <div className="grid gap-4">
                    <div>
                        <h3 className="text-sm font-semibold">Initial Investment</h3>
                        <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Annual Interest Rate (%)</h3>
                        <Input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value) || 0)} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Number of Years</h3>
                        <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 0)} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Monthly Contribution</h3>
                        <Input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Compounding Frequency</h3>
                        <Select value={compounding} onValueChange={setCompounding}>
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="365">Daily</SelectItem>
                                <SelectItem value="52">Weekly</SelectItem>
                                <SelectItem value="12">Monthly</SelectItem>
                                <SelectItem value="4">Quarterly</SelectItem>
                                <SelectItem value="1">Annually</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleCalculate} className="w-full mt-3">Calculate</Button>

                </div>
            </div>

            {result && (
                <div className="w-full p-5 border shadow-sm rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Investment Growth Over Time</h3>
                    <div className='flex gap-10 items-center justify-between'>
                        <div className='flex gap-2 w-1/2 items-center justify-between'>
                            <h2 className="text-sm mb-1">Total Investment:</h2>
                            <h2 className="text-sm font-semibold mb-1">{(principal + (monthlyContribution * years * 12)).toFixed(2)}</h2>
                        </div>
                        <div className='flex gap-2 w-1/2 items-center justify-between'>
                            <h2 className="text-sm mb-1">Total Interest:</h2>
                            <h2 className="text-sm font-semibold mb-1">{result.totalInterest.toFixed(2)}</h2>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center justify-between'>
                        <div className='flex gap-2 w-1/2 items-center justify-between'>
                            <h2 className="text-sm mb-1">Total (Principal + Interest):</h2>
                            <h2 className="text-sm font-semibold mb-1">{result.finalAmount.toFixed(2)}</h2>
                        </div>
                        <div className='flex gap-2 w-1/2 items-center justify-between'>
                            <h2 className="text-sm mb-1">Growth:</h2>
                            <h2 className="text-sm font-semibold mb-1">{((result.totalInterest / (principal + (monthlyContribution * years * 12))) * 100).toFixed(2)}%</h2>
                        </div>
                        </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Year</TableHead>
                                <TableHead className='text-right'>Total Amount</TableHead>
                                <TableHead className='text-right'>Interest Earned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.schedule.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.month/12}</TableCell>
                                    <TableCell className='text-right'>{row.total.toFixed(2)}</TableCell>
                                    <TableCell className='text-right'>{row.interest.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
