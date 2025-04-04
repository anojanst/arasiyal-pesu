'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const taxBrackets = {
    sriLanka: [
        { limit: 150000, rate: 0 },
        { limit: 233333, rate: 6 },
        { limit: 275000, rate: 12 },
        { limit: 316667, rate: 18 },
        { limit: 358333, rate: 24 },
        { limit: 400000, rate: 30 },
        { limit: Infinity, rate: 36 },
    ],
    newZealand: [
        { limit: 1175, rate: 10.5 },
        { limit: 4000, rate: 17.5 },
        { limit: 6000, rate: 30 },
        { limit: 15000, rate: 33 },
        { limit: Infinity, rate: 39 },
    ],
};

// Salary Frequency Multipliers
const frequencyMultipliers: Record<string, number> = {
    weekly: 4.33, // Approximate weeks per month
    biMonthly: 2, // Two payments per month
    monthly: 1,
    annually: 1 / 12, // Convert annual salary to monthly
};

// Function to Calculate Tax Based on Brackets
const calculateTax = (salary: number, country: 'sriLanka' | 'newZealand', isForeignIncome: boolean) => {
    if (salary <= 0) return { totalTax: 0, breakdown: [] };

    if (country === 'sriLanka' && isForeignIncome) {
        // Apply Flat 15% Tax for Foreign Income in Sri Lanka
        const taxAmount = (salary * 15) / 100;
        return {
            totalTax: taxAmount,
            breakdown: [{ range: "Flat 15% (Foreign Income)", taxableAmount: salary, taxAmount: taxAmount }]
        };
    }

    // Apply Progressive Tax Rates for Local Income (Sri Lanka) or New Zealand
    const brackets = taxBrackets[country];
    let tax = 0;
    let previousLimit = 0;
    let breakdown: { range: string; taxableAmount: number; taxAmount: number }[] = [];

    for (const { limit, rate } of brackets) {
        if (salary > previousLimit) {
            const taxableAmount = Math.min(salary, limit) - previousLimit;
            const taxAmount = (taxableAmount * rate) / 100;
            tax += taxAmount;
            breakdown.push({
                range: `${previousLimit.toLocaleString()} - ${limit === Infinity ? 'Above' : limit.toLocaleString()}`,
                taxableAmount: taxableAmount,
                taxAmount: taxAmount,
            });
        }
        previousLimit = limit;

        if (salary <= limit) break;
    }

    return { totalTax: tax, breakdown };
};

export default function TaxCalculator() {
    const [country, setCountry] = useState<'sriLanka' | 'newZealand'>('sriLanka');
    const [salary, setSalary] = useState<number>(0);
    const [frequency, setFrequency] = useState<'weekly' | 'biMonthly' | 'monthly' | 'annually'>('monthly');
    const [isForeignIncome, setIsForeignIncome] = useState<boolean>(false);
    const [taxDetails, setTaxDetails] = useState<{ totalTax: number; breakdown: any[] } | null>(null);
    const [convertedSalary, setConvertedSalary] = useState<number>(0);

    const handleCalculate = () => {
        const monthlySalary = salary * frequencyMultipliers[frequency];
        setConvertedSalary(monthlySalary);

        const taxData = calculateTax(monthlySalary, country, isForeignIncome);
        setTaxDetails(taxData);
    };

    return (
        <div className="flex p-5 gap-5">
            <div className='w-1/2 p-5 border shadow-sm rounded-lg'>
                <h2 className="text-lg font-semibold mb-4">Tax Calculator</h2>

                <h3 className="text-sm font-semibold">Select Country</h3>
                <Select value={country} onValueChange={(value) => setCountry(value as 'sriLanka' | 'newZealand')}>
                    <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sriLanka">🇱🇰 Sri Lanka</SelectItem>
                        <SelectItem value="newZealand">🇳🇿 New Zealand</SelectItem>
                    </SelectContent>
                </Select>

                {/* Salary Input */}
                <h3 className="text-sm font-semibold mt-4">Enter Salary</h3>
                <Input
                    type="number"
                    placeholder="Enter salary"
                    value={salary}
                    onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                    className="w-full h-10"
                />

                {/* Salary Frequency */}
                <h3 className="text-sm font-semibold mt-4">Payment Frequency</h3>
                <Select value={frequency} onValueChange={(value) => setFrequency(value as 'weekly' | 'biMonthly' | 'monthly' | 'annually')}>
                    <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biMonthly">Bi-Monthly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                </Select>

                {country === "sriLanka" && (
                    <div className="mt-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isForeignIncome}
                                onChange={() => setIsForeignIncome(!isForeignIncome)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Is this Foreign Income? (Flat 15% tax applies)</span>
                        </label>
                    </div>
                )}

                <Button onClick={handleCalculate} className="mt-4 w-full">
                    Calculate Tax
                </Button>
            </div>
            {taxDetails && (<div className='w-1/2 p-5 border shadow-sm rounded-lg'>

                
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tax Calculation Details</h3>
                        <div className='flex gap-2 items-center justify-between'>
                            <div>Gross Monthly Salary</div>
                            <div className='text-right'>{convertedSalary.toLocaleString()}</div>
                        </div>
                        <div className='flex gap-2 items-center justify-between'>
                            <div>Total Tax Payable</div>
                            <div className='text-right'> - {taxDetails.totalTax.toLocaleString()}</div>
                        </div>
                        <div className='flex gap-2 items-center justify-between'>
                            <div>Net Income After Tax</div>
                            <div className='text-right border-t-2 border-b-2 border-gray-800'>{(convertedSalary - taxDetails.totalTax).toLocaleString()}</div>
                        </div>

                        <h3 className="text-lg font-semibold mt-4">Tax Breakdown by Bracket</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Income Range</TableHead>
                                    <TableHead className='text-right'>Taxable Amount</TableHead>
                                    <TableHead className='text-right'>Tax Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxDetails.breakdown.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.range}</TableCell>
                                        <TableCell className='text-right'>{row.taxableAmount.toLocaleString()}</TableCell>
                                        <TableCell className='text-right'>{row.taxAmount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>)}
        </div>

    );
}
