"use client";

import { ThumbsUp, AlertTriangle, Info, Sparkles, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeedbackCardProps {
  type: 'success' | 'error' | 'info' | 'encouragement' | 'praise';
  message: string;
  className?: string;
}

const FeedbackCard = ({ type, message, className }: FeedbackCardProps) => {
  const typeConfig = {
    success: { Icon: ThumbsUp, colorClasses: 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300' },
    error: { Icon: AlertTriangle, colorClasses: 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300' },
    info: { Icon: Info, colorClasses: 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' },
    encouragement: { Icon: Lightbulb, colorClasses: 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300' },
    praise: { Icon: Sparkles, colorClasses: 'bg-purple-100 border-purple-500 text-purple-700 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300' },
  };

  const { Icon, colorClasses } = typeConfig[type];

  if (!message) return null;

  return (
    <Card className={cn("my-4 shadow-md", colorClasses, className)}>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className="h-8 w-8 flex-shrink-0" />
        <p className="text-lg font-medium">{message}</p>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
