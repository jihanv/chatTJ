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
                <div className="flex flex-col justify-start flex-1 gap-4 overflow-y-auto [scrollbar-color:#334155_#0f172a] [scrollbar-gutter:stable]  pr-5">
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
                <form className="h-14 bg-white/3 focus-within:bg-white/5  flex gap-3 items-center px-4 rounded-2xl transition-colors border border-white/10 focus-within:border-white/20" >
                    <input
                        type="text"
                        id="message"
                        name="message"
                        required
                        autoFocus
                        autoComplete="off"
                        defaultValue=""
                        placeholder="Ask a question..."
                        className="min-w-0 text-sm flex-1 bg-transparent text-white placeholder:text-white/40 outline-none leading-6"
                    />
                    <button
                        type="submit"
                        aria-label="Send message"
                        className="hover:bg-white/10 hover:text-white/90 cursor-pointer transition-colors flex h-9 w-9 focus-visible:bg-white/10 items-center justify-center rounded-full bg-white/5 text-sm text-white/70 focus-visible:ring-1  focus-visible:ring-white/20 focus-visible:text-white/90 shrink-0">
                        ↑
                    </button>
                </form >
            </div>
        </section>
    );
}