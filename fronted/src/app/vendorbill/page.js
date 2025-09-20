import { Suspense } from 'react';
import VendorBill from './vendor-bill';

export default function VendorBillPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorBill />
    </Suspense>
  );
}