"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { sql, eq } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses, Tags } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

const BudgetPieChart = () => {
    const {user} = useUser()
  const [data, setData] = useState<{ name: string; totalSpent: number }[]>([]);

  const getBudgetSpending = async (createdBy: string) => {
    const data = await db
      .select({
        name: Budgets.name,
        totalSpent: sql<number>`SUM(${Expenses.amount})`.as("totalSpent"),
      })
      .from(Budgets)
      .leftJoin(Tags, sql`${Tags.budgetId} = ${Budgets.id}`)
      .leftJoin(Expenses, sql`${Expenses.tagId} = ${Tags.id}`)
      .where(eq(Expenses.createdBy, createdBy))
      .groupBy(Budgets.name);
  
    
      const cleanedData = data.map((item) => ({
        name: item.name || "Uncategorized",
        totalSpent: Number(item.totalSpent),
      }));

      console.log(cleanedData);
    return cleanedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const budgets = await getBudgetSpending(user?.primaryEmailAddress?.emailAddress!);
      setData(budgets);
    };

    user && fetchData();
  }, [user]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="totalSpent" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BudgetPieChart;
