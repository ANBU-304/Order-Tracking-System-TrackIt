import { useState } from "react";
import { Package, TrendingUp } from "lucide-react";
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

  // ✅ Derived value (NO state, NO effect)
  const shippingCost = calculateShipping(weight);

  // ✅ Notify parent safely
  if (onShippingCostChange) {
    onShippingCostChange(shippingCost);
  }

  const getWeightRange = (weightInKg) => {
    if (weightInKg <= 0) return "Enter weight to calculate";
    if (weightInKg <= 1) return "0-1 kg";
    if (weightInKg <= 3) return "1-3 kg";
    if (weightInKg <= 5) return "3-5 kg";
    if (weightInKg <= 10) return "5-10 kg";
    return "10+ kg (custom rate)";
  };

  return (
    <Card className="border-0 shadow-md overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle>Estimated Shipping Cost</CardTitle>
            <CardDescription>
              Calculate shipping based on weight
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Product Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            value={weight || ""}
            onChange={(e) =>
              setWeight(parseFloat(e.target.value) || 0)
            }
            placeholder="Enter weight in kg"
            className="text-lg"
          />
          <p className="text-xs text-gray-500">
            Weight range: {getWeightRange(weight)}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Shipping Cost</span>
            <div className="flex items-center gap-1">
              <TrendingUp
                className={`w-4 h-4 ${
                  shippingCost > 0
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-2xl font-bold ${
                  shippingCost > 0
                    ? "text-indigo-600"
                    : "text-gray-400"
                }`}
              >
                ₹{shippingCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
