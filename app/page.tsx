import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-[#6b4d63] via-[#2d1f5a] to-[#14051f] px-6 py-12">
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <ChatInterface />
      </div>
    </main>
  );
}