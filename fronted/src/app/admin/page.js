import Dashboard from "@/components/dashboard";
import { NavigationMenuDemo } from "@/components/navbar";
import StickyExpandableButton from "@/components/plusicon";

export default function Page() {
  return (
    <>
      <div className="sticky top-0 bg-white z-50 w-full max-w-sm mx-auto">
        <NavigationMenuDemo />
      </div>

      {/* Rest of your page content */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Dashboard />
        <StickyExpandableButton />
      </div>
    </>
  );
}
