
"use client";

import { useMemo } from "react";
import { BarChart, Book, Tag, Type } from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "@/components/nav/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotes } from "@/hooks/use-notes";
import { useSettingsStore } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const font = useSettingsStore((state) => state.font);
  const fontClass = font.split(" ")[0];
  const notes = useNotes((state) => state.notes);
  const isLoading = useNotes((state) => state.isLoading);

  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const totalWords = notes.reduce((acc, note) => {
      const text =
        note.content?.blocks
          .map((block) => block.data.text || "")
          .join(" ") || "";
      return acc + text.split(/\s+/).filter(Boolean).length;
    }, 0);

    const tagCounts: { [key: string]: number } = {};
    notes.forEach((note) => {
      note.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, total: value }));

    return {
      totalNotes,
      totalWords,
      totalTags: Object.keys(tagCounts).length,
      topTags,
    };
  }, [notes]);

  if (isLoading) {
    return <Loading />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex h-full bg-background">
      <Sidebar />
      <div className={cn("flex-1 lg:pl-72", fontClass)}>
        <main className="h-full space-y-8 p-4 sm:p-6 lg:p-8">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              ড্যাশবোর্ড
            </h1>
            <p className="mt-2 text-muted-foreground">
              আপনার লেখার পরিসংখ্যান দেখুন।
            </p>
          </header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <StatCard
              title="মোট নোট"
              value={stats.totalNotes}
              icon={Book}
            />
            <StatCard
              title="মোট শব্দ"
              value={stats.totalWords.toLocaleString()}
              icon={Type}
            />
            <StatCard
              title="ব্যবহৃত ট্যাগ"
              value={stats.totalTags}
              icon={Tag}
            />
          </motion.div>

          {stats.topTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>সর্বাধিক ব্যবহৃত ট্যাগ</CardTitle>
                </CardHeader>
                <CardContent className="pr-0">
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={stats.topTags}>
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--accent))" }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
