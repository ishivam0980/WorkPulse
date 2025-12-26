import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const emojis = [
  "📋", "📁", "📂", "🗂️", "📊", "📈", "📉", "📑",
  "🎯", "🚀", "💡", "⚡", "🔥", "✨", "🌟", "💫",
  "🏆", "🎖️", "🥇", "🏅", "🎨", "🖌️", "🎭", "🎪",
  "💻", "🖥️", "📱", "⌨️", "🖱️", "💾", "📀", "🔌",
  "🌐", "🔗", "🔒", "🔓", "🔑", "🗝️", "🛡️", "⚔️",
  "📝", "✏️", "📌", "📍", "📎", "🔍", "🔎", "📐",
  "🎵", "🎶", "🎤", "🎧", "📻", "🎸", "🎹", "🎺",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
  "🌈", "☀️", "🌤️", "⛅", "🌧️", "❄️", "🌊", "🍃",
  "🍎", "🍊", "🍋", "🍒", "🍇", "🫐", "🍉", "🥝",
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  children: React.ReactNode;
}

export function EmojiPicker({ onSelect, children }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <ScrollArea className="h-48">
          <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-accent"
                onClick={() => onSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
