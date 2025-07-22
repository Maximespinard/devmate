import { motion } from 'framer-motion';

interface ToolHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function ToolHeader({ title, description, className = '' }: ToolHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`text-center space-y-2 mb-8 ${className}`}
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        {description}
      </p>
    </motion.div>
  );
}