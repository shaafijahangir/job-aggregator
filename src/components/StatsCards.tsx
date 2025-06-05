
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Clock, MapPin, TrendingUp } from 'lucide-react';

export const StatsCards = () => {
  const stats = [
    {
      title: "Total Jobs",
      value: "1,247",
      icon: Briefcase,
      change: "+12 today",
      changeType: "positive"
    },
    {
      title: "New Today",
      value: "23",
      icon: Clock,
      change: "+5 from yesterday",
      changeType: "positive"
    },
    {
      title: "BC Locations",
      value: "15",
      icon: MapPin,
      change: "Victoria, Vancouver, Burnaby...",
      changeType: "neutral"
    },
    {
      title: "Match Rate",
      value: "78%",
      icon: TrendingUp,
      change: "+3% this week",
      changeType: "positive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs mt-1 ${
              stat.changeType === 'positive' ? 'text-green-600' : 
              stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
