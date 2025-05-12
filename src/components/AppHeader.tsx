import { Bot } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="py-6 bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4">
        <Bot size={48} strokeWidth={2} />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">EduVision</h1>
      </div>
    </header>
  );
};

export default AppHeader;
