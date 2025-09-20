'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          // Handle no token case
          return;
        }
        const response = await fetch('http://127.0.0.1:5000/api/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("Failed to fetch dashboard stats");
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(amount || 0)}`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg">
      <h2 className="text-center text-lg font-semibold mb-4">Dashboard</h2>

      {/* Total Invoice */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-center gap-4 text-sm font-medium">
            <div>
              <div className="text-gray-400">Last 24 hours</div>
              <div>{formatCurrency(stats?.total_invoice['24h'])}</div>
            </div>
            <div>
              <div className="text-gray-400">Last 7 Days</div>
              <div>{formatCurrency(stats?.total_invoice['7d'])}</div>
            </div>
            <div>
              <div className="text-gray-400">Last 30 Days</div>
              <div>{formatCurrency(stats?.total_invoice['30d'])}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Purchase */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-center gap-4 text-sm font-medium">
            <div>
              <div className="text-gray-400">Last 24 hours</div>
              <div>{formatCurrency(stats?.total_purchase['24h'])}</div>
            </div>
            <div>
              <div className="text-gray-400">Last 7 Days</div>
              <div>{formatCurrency(stats?.total_purchase['7d'])}</div>
            </div>
            <div>
              <div className="text-gray-400">Last 30 Days</div>
              <div>{formatCurrency(stats?.total_purchase['30d'])}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Payment */}
      <Card>
        <CardHeader>
          <CardTitle>Total Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-center gap-4 text-sm font-medium">
            <div>
              <div className="text-gray-400">Last 24 hours</div>
              <div>{formatCurrency(stats?.total_payment['24h'])}</div>
            </div>
            <div>
              <div className="text-gray-400">Last 7 Days</div>
              <div>{formatCurrency(stats?.total_payment['7d'])}</div>
            </div>
            <div>
              <div className="text-gray-400">Last 30 Days</div>
              <div>{formatCurrency(stats?.total_payment['30d'])}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}