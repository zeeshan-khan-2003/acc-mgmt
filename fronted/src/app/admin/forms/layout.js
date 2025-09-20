import Formbar from "@/components/formsbar"


export default function AdminFormsLayout({ children }) {
  return (
    <>
      <Formbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">

      {children}
      </div>
    </>
  );
}
