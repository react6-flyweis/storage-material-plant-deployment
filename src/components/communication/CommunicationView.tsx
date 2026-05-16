import { useState } from "react";
import { 
  Search,  
  Megaphone, 
  BarChart2, 
  Hammer, 
  Plus, 
  MessageCircle, 
  Send,
  Video,
  Info,
  Bell,
  X,
  UserPlus
} from "lucide-react";
import Button from "../common_component/Button";

const CommunicationView = () => {
  const [activeTab, setActiveTab] = useState<"Departments" | "Direct">(
    "Departments"
  );
  const [activeChat, setActiveChat] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"Members" | "Files">("Members");

  const departments = [
    {
      id: 1,
      name: "Project Team",
      icon: <Megaphone size={18} className="text-white" />,
      color: "bg-[#4285F4]",
      count: 3,
      members: 2,
      category: "Marketing"
    },
    {
      id: 2,
      name: "Finance Team",
      icon: <BarChart2 size={18} className="text-white" />,
      color: "bg-[#00A389]",
      count: 0,
      members: 4,
      category: "Finance"
    },
    {
      id: 3,
      name: "Construction Team",
      icon: <Hammer size={18} className="text-white" />,
      color: "bg-[#FF9900]",
      count: 1,
      members: 8,
      category: "Operations"
    },
  ];

  const directMessages = [
    {
      id: 101,
      name: "Michael Chen (Project Lead)",
      avatar: "https://i.pravatar.cc/150?u=michael",
      status: "Online",
      role: "Project Lead"
    }
  ];

  const teamMembers = [
    { id: 1, name: "John Doe", role: "Marketing", avatar: "https://i.pravatar.cc/150?u=john", isAdmin: true },
    { id: 2, name: "James Wilson", role: "Marketing", avatar: "https://i.pravatar.cc/150?u=james", isAdmin: false },
  ];

  const chatMessages = [
    {
      id: 1,
      sender: "John Doe",
      avatar: "https://i.pravatar.cc/150?u=john",
      text: "Hi, I need a quote for a 40*60 workshop in Texas.",
      time: "2024-10-10 09:30 pm",
      isMe: false,
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      text: "Hello John! I'd be happy to help you with that. Can you tell me more about the intended use and any specific requirements?",
      time: "2024-10-10 09:30 pm",
      isMe: true,
    },
    {
      id: 3,
      sender: "Artificial Intelligence",
      icon: "🤖",
      text: "Okay Sir, sending details to your inbox",
      time: "2024-10-10 09:30 pm",
      isMe: false,
      isAI: true
    },
  ];

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      {/* Left Sidebar - Contact List */}
      <div className="hidden md:flex w-64 lg:w-80 border-r border-gray-200 flex-col bg-white shrink-0">
        {/* User Profile */}
        <div className="p-4 flex items-center gap-3">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?u=sarah"
              alt="Sarah Johnson"
              className="w-10 h-10 rounded-full border border-gray-100"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-[#051321] text-sm">Sarah Johnson</h3>
            <p className="text-xs text-[#637381]">Plant Lead</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-2 px-2">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "Departments"
                ? "text-[#4285F4]"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setActiveTab("Departments")}
          >
            Departments
            {activeTab === "Departments" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4285F4]" />
            )}
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "Direct"
                ? "text-[#4285F4]"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setActiveTab("Direct")}
          >
            Direct
            {activeTab === "Direct" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4285F4]" />
            )}
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {activeTab === "Departments" ? (
            departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  setActiveChat({ ...dept, type: "department" });
                  setIsDrawerOpen(false);
                }}
                className={`flex items-center justify-between p-3 cursor-pointer rounded-xl transition-colors group ${activeChat?.id === dept.id ? "bg-gray-50 shadow-sm" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 ${dept.color} rounded-lg shadow-sm flex items-center justify-center w-9 h-9`}>
                    {dept.icon}
                  </div>
                  <span className={`text-xs lg:text-sm font-semibold transition-colors truncate ${activeChat?.id === dept.id ? "text-[#4285F4]" : "text-[#051321] group-hover:text-[#4285F4]"}`}>
                    {dept.name}
                  </span>
                </div>
                {dept.count > 0 && (
                  <span className="bg-[#4285F4] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {dept.count}
                  </span>
                )}
              </div>
            ))
          ) : (
            directMessages.map((dm) => (
              <div
                key={dm.id}
                onClick={() => {
                  setActiveChat({ ...dm, type: "direct", color: "bg-gray-100", icon: <img src={dm.avatar} className="w-full h-full rounded-full" /> });
                  setIsDrawerOpen(false);
                }}
                className={`flex items-center gap-4 p-3 cursor-pointer rounded-xl transition-colors group ${activeChat?.id === dm.id ? "bg-gray-50 shadow-sm" : "hover:bg-gray-50"}`}
              >
                <div className="relative">
                  <img src={dm.avatar} alt={dm.name} className="w-10 h-10 rounded-full border border-gray-100" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className={`text-xs lg:text-sm font-semibold transition-colors truncate ${activeChat?.id === dm.id ? "text-[#4285F4]" : "text-[#051321] group-hover:text-[#4285F4]"}`}>
                  {dm.name}
                </span>
              </div>
            ))
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-600 hover:text-[#4285F4] transition-colors">
            <Plus size={18} /> New Chat
          </button>
        </div>

        {/* Team Online Status Indicator */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white"></div>
          <span className="text-xs font-semibold text-gray-500">Team Online</span>
        </div>
      </div>

      {/* Right Content - Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F7F9FC] relative">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div 
              className="p-2 lg:p-4 bg-white border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 ${activeChat.color} rounded-lg shadow-sm w-10 h-10 flex items-center justify-center overflow-hidden`}>
                  {activeChat.icon}
                </div>
                <div>
                  <h3 className="text-sm lg:text-base font-bold text-[#051321]">{activeChat.name}</h3>
                  <p className="text-xs text-[#637381]">{activeChat.type === "department" ? `${activeChat.members} members . ${activeChat.category}` : "Active Now"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-gray-600" onClick={(e) => { e.stopPropagation(); }}><Video size={20} /></button>
                <button className="hover:text-gray-600" onClick={(e) => { e.stopPropagation(); setIsDrawerOpen(!isDrawerOpen); }}><Info size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                  <div className={`flex items-center gap-3 mb-2 ${msg.isMe ? "flex-row-reverse" : ""}`}>
                    {msg.isAI ? (
                       <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm shadow-sm border border-gray-200">
                         🤖
                       </div>
                    ) : (
                      <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full border border-gray-200" />
                    )}
                    <span className="text-sm font-bold text-[#051321]">{msg.sender}</span>
                  </div>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-xs ${
                    msg.isMe 
                      ? "bg-[#4285F4] text-white rounded-tr-none" 
                      : "bg-white text-[#051321] rounded-tl-none"
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-2 ${msg.isMe ? "text-blue-100" : "text-[#637381]"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
              <MessageCircle size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-[#051321] mb-2">Select a chat to start messaging</h2>
            <p className="text-sm text-[#637381] max-w-md">
              Choose from your departments, direct messages, or cross-department channels
            </p>
          </div>
        )}

        {/* Chat Footer */}
        <div className="p-3 lg:p-6 bg-white border-t border-gray-100 mt-auto">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#4285F4] text-sm placeholder:text-gray-400 shadow-sm h-[44px]"
              />
            </div>
            <Button variant="gradient" size="sm" className="h-[44px] px-6">
              <Send size={18} /> Send
            </Button>
          </div>
          <div className="text-center mt-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
            Last sync: just now
          </div>
        </div>
      </div>

      {/* Right Sidebar Drawer */}
      {isDrawerOpen && activeChat && (
        <div className="absolute right-0 top-0 bottom-0 lg:relative w-72 lg:w-80 border-l border-gray-200 bg-white flex flex-col shadow-2xl lg:shadow-none z-20 animate-in slide-in-from-right duration-300">
          <div className="p-2 flex items-center justify-between">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          <div className="px-2 pb-4 text-center">
            <div
              className={`w-14 h-14 ${activeChat.color} rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-blue-100 mb-4 overflow-hidden`}
            >
              {activeChat.icon}
            </div>
            <h3 className="text-lg font-semibold text-[#051321]">
              {activeChat.name}
            </h3>
            <p className="text-xs text-[#637381] mt-1">
              {activeChat.type === "department"
                ? `${activeChat.members} members . ${activeChat.category}`
                : activeChat.role}
            </p>
            <p className="text-xs text-[#637381] mt-3 leading-relaxed">
              {activeChat.type === "department"
                ? "Marketing department discussions and campaigns"
                : "Direct messaging channel"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors">
              <Bell size={20} /> Mute
            </button>
          </div>

          {/* Drawer Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            <button
              className={`flex-1 py-3 text-sm font-semibold relative transition-colors ${
                drawerTab === "Members" ? "text-[#4285F4]" : "text-gray-400"
              }`}
              onClick={() => setDrawerTab("Members")}
            >
              Members
              {drawerTab === "Members" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4285F4]" />
              )}
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold relative transition-colors ${
                drawerTab === "Files" ? "text-[#4285F4]" : "text-gray-400"
              }`}
              onClick={() => setDrawerTab("Files")}
            >
              Files
              {drawerTab === "Files" && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4285F4]" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {drawerTab === "Members" ? (
              <>
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border border-gray-100"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#051321]">
                          {member.name}
                        </p>
                        <p className="text-xs text-[#637381]">{member.role}</p>
                      </div>
                    </div>
                    {member.isAdmin && (
                      <span className="px-3 py-1 bg-[#E6F0FF] text-[#4285F4] text-[10px] font-bold rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
                <button className="flex items-center gap-3 text-[#637381] hover:text-[#4285F4] transition-colors py-2 group">
                  <div className="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center group-hover:border-[#4285F4]">
                    <UserPlus size={20} />
                  </div>
                  <span className="text-sm font-semibold">Add member</span>
                </button>
              </>
            ) : (
              <div className="text-center text-sm text-gray-400 py-10">
                No files shared yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationView;
