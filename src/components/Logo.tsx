import React from "react";
import { Store } from "lucide-react";
import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export default function Logo({ className, iconSize = 24, textSize = "text-xl" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-900/20", className)}>
      <Store size={iconSize} className="text-emerald-400" />
      <h1 className={cn("font-bold uppercase tracking-[0.2em]", textSize)}>KantinKu</h1>
    </div>
  );
}
