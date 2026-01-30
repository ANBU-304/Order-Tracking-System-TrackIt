import { useState, useEffect } from "react";
import { Package, TrendingUp, Scale } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

export function ShippingCalculator({
  onShippingCostChange,
  initialWeight = 0,
}) {
  const [weight, setWeight] = useState(initialWeight);

  const calculateShipping = (weightInKg) => {
    if (weightInKg <= 0) return 0;
    if (weightInKg <= 1) return 50;
    if (weightInKg <= 3) return 90;
    if (weightInKg <= 5) return 150;
    if (weightInKg <= 10) return 250;
    return 250 + Math.ceil((weightInKg - 10) / 5) * 100;
  };

  const shippingCost = calculateShipping(weight);

  
  useEffect(() => {
    if (onShippingCostChange) {
      onShippingCostChange(shippingCost);
    }
  }, [shippingCost, onShippingCostChange]);

  const getWeightRange = (weightInKg) => {
    if (weightInKg <= 0) return "Enter weight to calculate";
    if (weightInKg <= 1) return "Standard (0-1 kg)";
    if (weightInKg <= 3) return "Medium (1-3 kg)";
    if (weightInKg <= 5) return "Heavy (3-5 kg)";
    if (weightInKg <= 10) return "Bulk (5-10 kg)";
    return "Freight (10+ kg custom)";
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden relative bg-white">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
            <Scale className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Cost Estimator</CardTitle>
            <CardDescription className="text-[11px] uppercase font-bold text-slate-400 tracking-tight">
              Weight-based logistics pricing
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="weight" className="text-xs font-bold text-slate-600">
              Shipment Weight
            </Label>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              UNIT: KG
            </span>
          </div>
          <div className="relative">
             <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={weight || ""}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="text-lg font-bold border-slate-200 focus:ring-slate-900 focus:border-slate-900 rounded-xl h-12 pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold italic">
              kg
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
            Category: <span className="text-slate-900">{getWeightRange(weight)}</span>
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group">
          {/* Subtle background icon for design depth */}
          <TrendingUp className="absolute -right-2 -bottom-2 w-16 h-16 text-slate-200/50 -rotate-12 group-hover:text-yellow-400/20 transition-colors" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Total</span>
              <span className="text-xs text-slate-500 font-medium italic">Incl. fuel surcharge</span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`text-2xl font-black transition-colors ${
                  shippingCost > 0 ? "text-slate-900" : "text-slate-300"
                }`}
              >
                ₹{shippingCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            Rates are subject to real-time fuel fluctuations
          </span>
        </div>
      </CardContent>
    </Card>
  );
}