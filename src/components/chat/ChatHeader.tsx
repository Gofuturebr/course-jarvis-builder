
import { Menu } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex items-center px-4 py-3 border-b">
      <Menu className="mr-3 h-5 w-5 text-gray-600" />
      <div className="flex items-center">
        <span className="text-xl font-bold text-jarvis-foreground">
          GO
          <span className="font-black">cursos</span>
        </span>
      </div>
    </header>
  );
}
