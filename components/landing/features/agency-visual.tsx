"use client";

import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, Calendar, Users, Target, BarChart2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample Data
const visibilityData = [
  { date: "Jan 19", value: 45 },
  { date: "Jan 20", value: 52 },
  { date: "Jan 21", value: 49 },
  { date: "Jan 22", value: 55 },
  { date: "Jan 23", value: 58 },
  { date: "Jan 24", value: 62 },
  { date: "Jan 25", value: 60 },
  { date: "Jan 26", value: 65 },
  { date: "Jan 27", value: 63 },
  { date: "Jan 28", value: 68 }, 
  { date: "Jan 29", value: 70 },
  { date: "Jan 30", value: 72 },
  { date: "Jan 31", value: 71 },
  { date: "Feb 01", value: 75 },
  { date: "Feb 02", value: 74 },
  { date: "Feb 03", value: 78 },
  { date: "Feb 04", value: 80 },
  { date: "Feb 05", value: 79 },
  { date: "Feb 06", value: 82 },
  { date: "Feb 07", value: 85 },
  { date: "Feb 08", value: 83 }, 
  { date: "Feb 09", value: 86 }, 
  { date: "Feb 10", value: 88 },
  { date: "Feb 11", value: 87 },
  { date: "Feb 12", value: 89 },
  { date: "Feb 13", value: 90 },
  { date: "Feb 14", value: 91 },
  { date: "Feb 15", value: 92 },
  { date: "Feb 16", value: 93 },
  { date: "Feb 17", value: 94 },
];

const totalKeywordsData = [
  { date: "Tue", value: 140 },
  { date: "Wed", value: 142 },
  { date: "Thu", value: 145 },
  { date: "Fri", value: 143 },
  { date: "Sat", value: 148 },
  { date: "Sun", value: 152 },
];

const avgRankData = [
  { date: "Tue", value: 12 },
  { date: "Wed", value: 11.5 },
  { date: "Thu", value: 11 },
  { date: "Fri", value: 10.8 },
  { date: "Sat", value: 10.5 },
  { date: "Sun", value: 10.2 },
];

const shareOfVoiceData = [
  { date: "Tue", value: 10 },
  { date: "Wed", value: 10.5 },
  { date: "Thu", value: 11.2 },
  { date: "Fri", value: 11.5 },
  { date: "Sat", value: 12.1 },
  { date: "Sun", value: 12.8 },
];

export function AgencyVisual() {
  const t = useTranslations("featuresAndPricing.pricingFeature");

  return (
    <div className="w-full h-full relative p-4 lg:p-6 bg-background rounded-xl overflow-hidden ring-1 ring-foreground/10 shadow-sm flex flex-col gap-6 [mask-image:linear-gradient(to_top,transparent_5%,black_40%)]">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between z-10 relative">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Visibility Overview</h2>
          <p className="text-muted-foreground text-sm">Jan 19, 2026 - Feb 17, 2026</p>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground hover:text-foreground">
          <Calendar className="h-4 w-4" />
          Last 30 days
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 z-10 relative pb-10">
        {/* Card 1: Visibility Score - Large Card */}
        <Card className="lg:col-span-4 ring-1 ring-foreground/10 shadow-sm bg-card/50 backdrop-blur-sm [mask-image:linear-gradient(to_top,transparent_5%,black_40%)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Your GEO Score trend across all platforms</CardTitle>
              <CardDescription className="text-xs">Daily tracking of your brand&apos;s AI visibility score</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visibilityData}>
                    <defs>
                      <linearGradient id="colorVisibility" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: "var(--muted-foreground)"}} 
                        tickMargin={10}
                        minTickGap={30}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: "var(--muted-foreground)"}} 
                        tickFormatter={(value) => `${value}`}
                        domain={[0, 100]}
                    />
                     <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--primary)" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorVisibility)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Keywords */}
        <Card className="ring-1 ring-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keywords</CardTitle>
             <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
               <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
               <span className="text-green-500 font-medium">+12</span>
               <span className="ml-1">from last month</span>
            </div>
             <div className="h-[40px] w-full mt-3">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={totalKeywordsData}>
                         <defs>
                            <linearGradient id="colorKeywords" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#colorKeywords)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
        
         {/* Card 3: Avg Rank */}
         <Card className="ring-1 ring-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rank</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.2</div>
             <div className="flex items-center text-xs text-muted-foreground mt-1">
               <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
               <span className="text-green-500 font-medium">+1.3</span>
               <span className="ml-1">positions up</span>
            </div>
             <div className="h-[40px] w-full mt-3">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={avgRankData}>
                          <defs>
                            <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#colorRank)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* Card 4: Share of Voice */}
        <Card className="ring-1 ring-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share of Voice</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.8%</div>
             <div className="flex items-center text-xs text-muted-foreground mt-1">
               <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
               <span className="text-green-500 font-medium">+2.3%</span>
               <span className="ml-1">from last month</span>
            </div>
             <div className="h-[40px] w-full mt-3">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={shareOfVoiceData}>
                         <defs>
                            <linearGradient id="colorShare" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#colorShare)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      
        {/* Card 5: Traffic Share */}
         <Card className="ring-1 ring-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traffic Share</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5%</div>
             <div className="flex items-center text-xs text-muted-foreground mt-1">
               <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
               <span className="text-green-500 font-medium">+1.2%</span>
               <span className="ml-1">from last month</span>
            </div>
             <div className="h-[40px] w-full mt-3">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={shareOfVoiceData}> {/* Reusing simplified data */}
                         <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#colorTraffic)" />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
