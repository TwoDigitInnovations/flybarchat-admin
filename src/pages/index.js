"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Users,
  UserPlus,
  UserCheck,
  MessageCircle,
  Grid2X2,
  Music,
  TrendingUp,
  TrendingDown
} from "lucide-react";

function StatCard({ label, value, change, icon: Icon, positive = true }) {
  return (
    <div className="bg-white border border-gray-700 rounded-xl p-5 flex flex-col gap-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex justify-between items-start">
        <span className="text-[16px] text-black font-medium">{label}</span>
        <Icon className={`text-red-400`} size={20} />
      </div>

      <div className="text-2xl font-bold text-black tracking-tight">
        {value}
      </div>

      {change && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
          <span className="text-gray-500 font-normal">
            {positive ? " increase" : " decrease"}
          </span>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const router = useRouter();

  return (
    <section className="bg-secondary  min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto">

      
        <div className="flex items-center gap-2 mb-7">
          <h1 className="text-xl font-bold text-white tracking-wide uppercase">
            Dashboard
          </h1>
          <span className="text-gray-600">›</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Statistics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers?.toLocaleString() ?? "121,168,658"}
            change={`+${stats?.weeklyGrowth ?? "11.01"}%`}
            icon={Users}
            positive
          />
          <StatCard
            label="New Users"
            value={stats?.newUsers?.toLocaleString() ?? "1,457"}
            change="+5%"
            icon={UserPlus}
            positive
          />
          <StatCard
            label="Active Users"
            value={stats?.activeUsers?.toLocaleString() ?? "5,653"}
            change="+16%"
            icon={UserCheck}
            positive
          />
          <StatCard
            label="Queries"
            value={stats?.totalQueries?.toLocaleString() ?? "728,564"}
            change="+25%"
            icon={MessageCircle}
            positive
          />
        </div>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Menus"
            value={stats?.totalMenus?.toLocaleString() ?? "15"}
            change="+2.01%"
            icon={Grid2X2}
            positive
          />
          <StatCard
            label="Total Songs"
            value={stats?.totalSongs?.toLocaleString() ?? "800"}
            change="+5%"
            icon={Music}
            positive
          />

          <div className="bg-white border border-gray-700 rounded-xl p-5 flex items-center justify-center text-black text-md ">
            lorem ipsum
          </div>
          <div className="bg-white border border-gray-700 rounded-xl p-5 flex items-center justify-center text-black text-md ">
            lorem ipsum
          </div>
        </div>

      </div>
    </section>
  );
}

export default AdminDashboard;
