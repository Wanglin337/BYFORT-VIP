import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Lightbulb, TrendingUp, DollarSign, Gift, ShoppingBag, CreditCard } from "lucide-react";
import type { Monetization } from "@shared/schema";

interface MonetizationModalProps {
  onClose: () => void;
}

export default function MonetizationModal({ onClose }: MonetizationModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: monetization, isLoading } = useQuery<Monetization>({
    queryKey: ["/api/monetization", user?.id],
    enabled: !!user?.id,
  });

  const updateMonetizationMutation = useMutation({
    mutationFn: async (updates: Partial<Monetization>) => {
      const response = await apiRequest("PATCH", `/api/monetization/${user?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/monetization"] });
    },
  });

  const formatCurrency = (cents: number = 0) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatPercentage = (value: number = 0) => {
    return `${(value / 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-dark-primary z-50 flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="w-72 h-32 bg-gray-800 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 bg-gray-800 rounded-xl" />
            <Skeleton className="h-20 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark-primary z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="text-lg font-semibold text-white">Creator Fund</h3>
          <button className="text-gray-400 hover:text-white">
            <Lightbulb className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-6">
          {/* Earnings overview */}
          <div className="bg-gradient-to-r from-accent-pink to-accent-blue rounded-xl p-6 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(monetization?.monthlyEarnings)}
              </div>
              <div className="text-sm opacity-90">Total Earnings This Month</div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-card rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">1.2M</div>
              <div className="text-sm text-gray-400">Video Views</div>
              <div className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% this week
              </div>
            </div>
            <div className="bg-dark-card rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {formatPercentage(monetization?.engagementRate)}
              </div>
              <div className="text-sm text-gray-400">Engagement Rate</div>
              <div className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.1% this week
              </div>
            </div>
            <div className="bg-dark-card rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">+1,423</div>
              <div className="text-sm text-gray-400">New Followers</div>
              <div className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                This week
              </div>
            </div>
            <div className="bg-dark-card rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {formatCurrency(monetization?.weeklyEarnings)}
              </div>
              <div className="text-sm text-gray-400">This Week</div>
              <div className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23% vs last week
              </div>
            </div>
          </div>

          {/* Monetization options */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Monetization Options</h4>

            <div className="bg-dark-card rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <div>
                    <div className="font-semibold text-white">Creator Fund</div>
                    <div className="text-sm text-gray-400">Earn from video views</div>
                  </div>
                </div>
                <div className="text-green-400 font-semibold">
                  {monetization?.creatorFundEnabled ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Gift className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="font-semibold text-white">Virtual Gifts</div>
                    <div className="text-sm text-gray-400">Receive gifts from fans</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateMonetizationMutation.mutate({
                      virtualGiftsEnabled: !monetization?.virtualGiftsEnabled,
                    })
                  }
                  className={`border-accent-pink text-accent-pink hover:bg-accent-pink hover:text-white ${
                    monetization?.virtualGiftsEnabled ? "bg-accent-pink text-white" : ""
                  }`}
                >
                  {monetization?.virtualGiftsEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="font-semibold text-white">Brand Partnerships</div>
                    <div className="text-sm text-gray-400">Collaborate with brands</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent-pink text-accent-pink hover:bg-accent-pink hover:text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Payment settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Payment Settings</h4>
            <div className="bg-dark-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white">Payment Method</span>
                <Button variant="outline" size="sm" className="text-accent-pink border-accent-pink">
                  Edit
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">
                  {monetization?.paymentMethod || "•••• •••• •••• 1234"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
