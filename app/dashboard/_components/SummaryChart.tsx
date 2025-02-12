"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { sql, eq } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

const SummaryChart = () => {
    const [data, setData] = useState<{ date: string; totalAmount: number }[]>([]);
    const [maxValue, setMaxValue] = useState<number>(100);

    const { user } = useUser()

    const getExpensesByDate = async (userEmail: string) => {
        const data = await db
            .select({
                date: Expenses.date,
                totalAmount: sql<number>`SUM(${Expenses.amount})`.as("totalAmount"),
            })
            .from(Expenses)
            .where(eq(Expenses.createdBy, userEmail))
            .groupBy(Expenses.date)
            .orderBy(Expenses.date);

        setMaxValue(Math.max(...data.map((item) => item.totalAmount)))

        return data;
    };

    useEffect(() => {
        const fetchData = async () => {
            const expenses = await getExpensesByDate(user?.primaryEmailAddress?.emailAddress!);
            setData(expenses);
        };

        fetchData();
    }, [user]);

    return (
        <div className="w-full h-[520px] justify-start items-start">
            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
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
