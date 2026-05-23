import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

interface Message {
  _id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: "image" | "file"; size: string }[];
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages : Message[]
}

const sampleConversations: Conversation[] = [
  {
    _id: "1",
    userId: "1",
    title: "SaaS Dashboard Architecture",
    lastMessage: "Here's the component tree for the dashboard...",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    messageCount: 12,
    messages: [
      {
        _id: "1",
        conversationId: "1",
        role: "assistant",
        content: "Hey! I'm your AI assistant. I can help you build software, design systems, write code, and more.\n\nTell me what you're working on, or try one of these:\n\n- **\"Design a user authentication system\"**\n- **\"Build a REST API for a blog\"**\n- **\"Create a React component library\"**",
        timestamp: new Date(),
      },
    ],
  },
  {
    _id: "2",
    userId: "1",
    title: "REST API Design",
    lastMessage: "The endpoints should follow RESTful conventions...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messageCount: 8,
    messages: [
      {
        _id: "1",
        conversationId: "1",
        role: "assistant",
        content: "Hey! I'm your AI assistant. I can help you build software, design systems, write code, and more.\n\nTell me what you're working on, or try one of these:\n\n- **\"Design a user authentication system\"**\n- **\"Build a REST API for a blog\"**\n- **\"Create a React component library\"**",
        timestamp: new Date(),
      },
    ],
  },
  {
    _id: "3",
    userId: "1",
    title: "Auth Flow with OAuth 2.0",
    lastMessage: "For the token refresh strategy, consider...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messageCount: 15,
    messages: [
      {
        _id: "1",
        conversationId: "1",
        role: "assistant",
        content: "Hey! I'm your AI assistant. I can help you build software, design systems, write code, and more.\n\nTell me what you're working on, or try one of these:\n\n- **\"Design a user authentication system\"**\n- **\"Build a REST API for a blog\"**\n- **\"Create a React component library\"**",
        timestamp: new Date(),
      },
    ],
  },
  {
    _id: "4",
    userId: "1",
    title: "Database Schema Design",
    lastMessage: "The normalized schema would look like this...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    messageCount: 6,
    messages: [
      {
        _id: "1",
        conversationId: "1",
        role: "assistant",
        content: "Hey! I'm your AI assistant. I can help you build software, design systems, write code, and more.\n\nTell me what you're working on, or try one of these:\n\n- **\"Design a user authentication system\"**\n- **\"Build a REST API for a blog\"**\n- **\"Create a React component library\"**",
        timestamp: new Date(),
      },
    ],
  },
  {
    _id: "5",
    userId: "1",
    title: "CI/CD Pipeline Setup",
    lastMessage: "I recommend using GitHub Actions with...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    messageCount: 4,
    messages: [
      {
        _id: "1",
        conversationId: "1",
        role: "assistant",
        content: "Hey! I'm your AI assistant. I can help you build software, design systems, write code, and more.\n\nTell me what you're working on, or try one of these:\n\n- **\"Design a user authentication system\"**\n- **\"Build a REST API for a blog\"**\n- **\"Create a React component library\"**",
        timestamp: new Date(),
      },
    ],
  },
];

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const ChatLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const [conversation] = useState<Conversation[]>(sampleConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  
  const activeConversation = id;

  const filteredConversations = conversation.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 shrink-0 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">BuilderAI</span>
          </Link>
          <div className="h-5 w-px bg-border/60" />
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            AI Chat
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link to="/my-space">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Workspace
            </Button>
          </Link>
          <div className="h-4 w-px bg-border/50" />
          <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Area */}
        <Outlet />

        {/* Right: History Sidebar */}
        <div className="w-[350px] shrink-0 border-l border-border/50 flex flex-col bg-card/30">
          {/* History Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-border/50 shrink-0">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              History
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-primary"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/60 ring-1 ring-border/40">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-2 pb-2 space-y-0.5">
              {filteredConversations.map((conv) => (
                <Link
                  key={conv._id}
                  to={`/chat/${conv._id}`}
                  className={`w-full flex flex-col text-left px-3 py-2.5 rounded-xl transition-all group ${
                    activeConversation === conv._id
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : "hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare
                        className={`w-3.5 h-3.5 shrink-0 ${
                          activeConversation === conv._id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium truncate ${
                          activeConversation === conv._id ? "text-foreground" : "text-foreground/80"
                        }`}
                      >
                        {conv.title}
                      </span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary">
                      <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-1 ml-5.5 pl-[22px]">
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 pl-[22px]">
                    <span className="text-[10px] text-muted-foreground/60">{formatTime(conv.timestamp)}</span>
                    <span className="text-[10px] text-muted-foreground/40">·</span>
                    <span className="text-[10px] text-muted-foreground/60">{conv.messageCount} msgs</span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
