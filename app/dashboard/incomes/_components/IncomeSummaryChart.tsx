"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { sql, eq, and, gte,lte } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { subDays, startOfMonth, format, startOfYear } from "date-fns";
import { Button } from "@/components/ui/button";

const IncomeSummaryChart = () => {
    const [data, setData] = useState<{ date: string; totalAmount: number }[]>([]);
    const [maxValue, setMaxValue] = useState<number>(100);
    const [period, setPeriod] = useState<string>("month");

    const { user } = useUser()

    const getIncomes = async (userEmail: string, period:string) => {
        const today = new Date();
        let startDate = startOfMonth(today);
        if (period === "year") {
            startDate = startOfYear(today);
        }

    // Format dates for querying
    const formattedToday = format(today, 'yyyy-MM-dd');
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    
        const data = await db
            .select({
                date: Incomes.date,
                totalAmount: sql<number>`SUM(${Incomes.amount})`.as("totalAmount"),
            })
            .from(Incomes)
            .where(
                and(
                    eq(Incomes.createdBy, userEmail),
                    gte(Incomes.date, formattedStartDate),
                    lte(Incomes.date, formattedToday)
                )
            )
            .groupBy(Incomes.date)
            .orderBy(Incomes.date);

            console.log(data)
    
        setMaxValue(Math.max(...data.map((item) => item.totalAmount)));
    
        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            const Incomes = await getIncomes(user?.primaryEmailAddress?.emailAddress!, period);
            setData(Incomes);
        };
        (user && period) && fetchData();
    }, [user, period]);

    return (
        <div className="w-full h-[340px] justify-start items-start border rounded-lg mt-5">
            <div className="flex justify-end items-center p-3 gap-2">

            <Button onClick={()=>setPeriod("month")} variant="outline" className={`h-8 ${period === "month" && "bg-primary text-white"}`}>This Month</Button>
            <Button onClick={()=>setPeriod("year")} variant="outline" className={`h-8 ${period ==="year" && "bg-primary text-white"}`}>This Year</Button>
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
                        formatter={(value) => [`$${value}`, "Total Income"]}
                        labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />

                    <Line type="monotone" dataKey="totalAmount" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeSummaryChart;
