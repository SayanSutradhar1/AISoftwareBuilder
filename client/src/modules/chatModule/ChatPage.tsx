import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  FileText,
  Image,
  Paperclip,
  Send,
  User,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useParams } from "react-router-dom";

const getConversations = (id: string): Message[] => {
  console.log(id)
  return [
    {
      _id: "1",
      conversationId: "1",
      role: "assistant",
      content:
        "Hey! I'm your AI assistant. I can help you build software, design systems, write code, and more.\n\nTell me what you're working on, or try one of these:\n\n- **\"Design a user authentication system\"**\n- **\"Build a REST API for a blog\"**\n- **\"Create a React component library\"**",
      timestamp: new Date(),
      attachments: [
        {
          name: "file.txt",
          type: "file",
          size: "1KB",
        },
      ],
    },
  ]
}

interface Message {
  _id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: "image" | "file"; size: string }[];
}

const ChatPage = () => {
  const { id } = useParams(); // conversation id

  const [messages, setMessages] = useState<Message[]>([])

  // Optionally, when conversation 'id' changes, fetch/set new messages
  useEffect(() => {
    const messages = getConversations(id as string)
    setMessages(messages)
  }, [id]);

  const [userPrompt, setUserPrompt] = useState({
    message: "",
    attachments: [] as { name: string; type: "image" | "file"; size: string }[]
  })


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [userPrompt.message]);

  const startStreaming = () => {
    const promptMessage = userPrompt.message.trim();
    if (!promptMessage && userPrompt.attachments.length === 0) return;

    // Add user message to UI
    const newUserMsg: Message = {
      _id: Date.now().toString(),
      conversationId: id || "1",
      role: "user",
      content: promptMessage,
      timestamp: new Date(),
      attachments: userPrompt.attachments,
    };

    const newAssistantMsg: Message = {
      _id: (Date.now() + 1).toString(),
      conversationId: id || "1",
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg, newAssistantMsg]);

    setUserPrompt({ message: "", attachments: [] })

    // Trigger Stream
    const eventSource = new EventSource(
      `http://localhost:3000/ai/stream?prompt=${encodeURIComponent(promptMessage)}`
    );

    eventSource.onmessage = (event) => {
      // In many SSE implementations done events send [DONE] string
      if (event.data === "[DONE]") {
        eventSource.close();
        return;
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + event.data
          };
        }
        return newMessages;
      });
    };

    eventSource.onerror = (err) => {
      console.error("Stream error:", err);
      eventSource.close();
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startStreaming();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments = Array.from(files).map((f) => ({
      name: f.name,
      type,
      size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)}MB` : `${(f.size / 1024).toFixed(0)}KB`,
    }));
    setUserPrompt((prev) => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }))
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setUserPrompt((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }))
  };

  // Only show messages belonging to the current conversation ID
  // const conversationMessages = messages.filter((msg) => msg.conversationId === (id || "1"));

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="w-full mx-auto px-6 py-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className={`flex gap-3 w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant"
                    ? "bg-primary/10 ring-1 ring-primary/20"
                    : "bg-secondary ring-1 ring-border/50"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  )}
                </div>
                <div className={`flex flex-col flex-1 min-w-0 space-y-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex items-center gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="text-xs font-semibold text-foreground">
                      {msg.role === "assistant" ? "BuilderAI" : "You"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 ring-1 ring-border/50 text-xs"
                        >
                          {att.type === "image" ? (
                            <Image className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          <span className="text-foreground font-medium truncate max-w-[120px]">{att.name}</span>
                          <span className="text-muted-foreground">{att.size}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.role === "assistant" && msg.content === "" ? (
                    <div className="flex flex-col gap-2 p-4 bg-muted rounded-2xl rounded-tl-sm w-48">
                      <div className="h-3 bg-muted-foreground/20 rounded-md w-full animate-pulse"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded-md w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded-md w-5/6 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className={`text-sm leading-relaxed max-w-none ${msg.role === "user"
                      ? "bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm"
                      : "bg-muted text-foreground/90 p-4 rounded-2xl rounded-tl-sm prose prose-sm dark:prose-invert prose-headings:font-semibold prose-code:bg-secondary prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl"
                      }`}>
                      {msg.role === "user" ? (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Bottom: Input Area */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm p-4">
        <div className="w-full mx-auto">
          {/* Attachments Preview */}
          <AnimatePresence>
            {userPrompt.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-3"
              >
                {userPrompt.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg bg-secondary ring-1 ring-border/50 text-xs group"
                  >
                    {att.type === "image" ? (
                      <Image className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-foreground font-medium truncate max-w-[100px]">{att.name}</span>
                    <span className="text-muted-foreground">{att.size}</span>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="ml-0.5 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2 rounded-2xl bg-background ring-1 ring-border/60 shadow-md focus-within:ring-primary/40 focus-within:shadow-lg transition-all p-2">
            {/* Attachment buttons */}
            <div className="flex items-center gap-0.5 pb-0.5">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e, "image")}
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e, "file")}
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Attach image"
              >
                <Image className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={userPrompt.message}
              onChange={(e) => setUserPrompt({ ...userPrompt, message: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... describe what you want to build"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none min-h-[36px] max-h-[150px] leading-relaxed py-1.5"
            />

            <Button
              onClick={startStreaming}
              disabled={!userPrompt.message.trim() && userPrompt.attachments.length === 0}
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-all"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
            BuilderAI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;