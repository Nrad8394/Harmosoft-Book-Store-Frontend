import dynamic from "next/dynamic";

const BooksTablePageContent = dynamic(() => import("./BooksTablePageContent"), {
  ssr: false, // Disable server-side rendering
});

export default function BooksTablePage() {
  return <BooksTablePageContent />;
}
