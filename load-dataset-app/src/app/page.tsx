import DatasetFetcher from "@/components/DatasetFetcher";
import FileDrop from "@/components/FileDrop";
import FileFetcher from "@/components/FileFetcher";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-4">
        <FileDrop />
        <FileFetcher />
        <DatasetFetcher />
      </main>
    </div>
  );
}
