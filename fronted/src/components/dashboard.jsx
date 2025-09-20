import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
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
              <div>₹ 0</div>
            </div>
            <div>
              <div className="text-gray-400">Last 7 Days</div>
              <div>₹ 23,610</div>
            </div>
            <div>
              <div className="text-gray-400">Last 30 Days</div>
              <div>₹ 23,610</div>
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
              <div>₹ 0</div>
            </div>
            <div>
              <div className="text-gray-400">Last 7 Days</div>
              <div>₹ 17,857</div>
            </div>
            <div>
              <div className="text-gray-400">Last 30 Days</div>
              <div>₹ 17,857</div>
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
              <div>₹ 0</div>
            </div>
            <div>
              <div className="text-gray-400">Last 7 Days</div>
              <div>₹ 5,752</div>
            </div>
            <div>
              <div className="text-gray-400">Last 30 Days</div>
              <div>₹ 5,752</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-red-500 text-center">
            &lt; 80.0 %
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
