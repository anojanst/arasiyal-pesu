"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { sql, eq, and, gte,lte } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { subDays, startOfMonth, format } from "date-fns";
import { Button } from "@/components/ui/button";

const SummaryChart = () => {
    const [data, setData] = useState<{ date: string; totalAmount: number }[]>([]);
    const [maxValue, setMaxValue] = useState<number>(100);
    const [days, setDays] = useState<number>(7);

    const { user } = useUser()

    const getExpensesByDate = async (userEmail: string, days:number) => {
        const today = new Date();
        const maxDaysAgo = subDays(today, days);
        const startOfCurrentMonth = startOfMonth(today);
    
        const formattedStartOfMonth = format(startOfCurrentMonth, 'yyyy-MM-dd');
        const formattedSevenDaysAgo = format(maxDaysAgo, 'yyyy-MM-dd');
        const formattedToday = format(today, 'yyyy-MM-dd');
    
        const data = await db
            .select({
                date: Expenses.date,
                totalAmount: sql<number>`SUM(${Expenses.amount})`.as("totalAmount"),
            })
            .from(Expenses)
            .where(
                and(
                    eq(Expenses.createdBy, userEmail),
                    gte(Expenses.date, formattedStartOfMonth),
                    gte(Expenses.date, formattedSevenDaysAgo), 
                    lte(Expenses.date, formattedToday)
                )
            )
            .groupBy(Expenses.date)
            .orderBy(Expenses.date);
    
        setMaxValue(Math.max(...data.map((item) => item.totalAmount)));
    
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            const expenses = await getExpensesByDate(user?.primaryEmailAddress?.emailAddress!, days);
            setData(expenses);
        };

        fetchData();
    }, [user, days]);

    return (
        <div className="w-full h-[340px] justify-start items-start">
            <div className="flex justify-end items-center p-3 gap-2">

            <Button onClick={()=>setDays(7)} variant="outline" className={`h-8 ${days ===7 && "bg-primary text-white"}`}>Last 7 Days</Button>
            <Button onClick={()=>setDays(30)} variant="outline" className={`h-8 ${days ===30 && "bg-primary text-white"}`}>This Month</Button>
            </div>
            
            <ResponsiveContainer width="100%" height={290}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}
                        padding={{ left: 10, right: 10 }}
                    />

                    <YAxis domain={[0, maxValue]} allowDecimals={false} />

                    <Tooltip
                        formatter={(value) => [`$${value}`, "Total Spent"]}
                        labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />

                    <Line type="monotone" dataKey="totalAmount" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SummaryChart;
