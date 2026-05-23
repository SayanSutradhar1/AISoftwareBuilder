import { Route, Routes } from "react-router-dom"
import ChatLayout from "./ChatLayout"
import ChatPage from "./ChatPage"

const ChatModule = () => {
    return (
        <Routes>
            <Route path="/" element={<ChatLayout />}>
                <Route index element={<div className="flex-1 flex items-center justify-center">Click on a Chat to start</div>} />
                <Route path=":id" element={<ChatPage />} />
            </Route>
        </Routes>
    )
}

export default ChatModule