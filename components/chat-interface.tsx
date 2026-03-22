const messages = [
    { role: "user", text: "Do you cover AI in your courses?" },
    { role: "assistant", text: "Yes, we have an AI Engineering Path aimed at developers who want to learn about implementing AI solutions." }
]

export default function ChatInterface() {
    return (
        <section className="text-white h-[80%] p-8 w-3/4 lg:max-w-2xl rounded-4xl bg-slate-900">
            <h1 className="text-3xl font-semibold">ChatTJ</h1>
            <p className="mt-2 text-sm uppercase  tracking-wide text-white/60">
                Knowledge Bank
            </p>
            <div className="mt-8 flex flex-col h-[80%] rounded-3xl border p-6 border-white/10">
                <div className="flex flex-col justify-start flex-1 gap-4 overflow-y-scroll [scrollbar-color:#334155_#0f172a] [scrollbar-gutter:stable]  pr-5">
                    {messages.map((message, index) => (
                        <p
                            key={index}
                            className={`inline-block w-fit rounded-2xl max-w-[80%] px-4 py-2 leading-6 ${message.role === "user"
                                ? "self-end bg-teal-900/40"
                                : "self-start bg-slate-600/35"
                                }`}
                        >
                            {message.text}
                        </p>
                    ))}
                </div>
                <div className="h-14 flex justify-between items-center px-4 rounded-2xl border border-white/10" >
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none"
                    />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm text-white/70">
                        ↑
                    </div>
                </div>
            </div>
        </section>
    );
}