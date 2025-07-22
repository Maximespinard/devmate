import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function GeneratorsPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Generators" 
        description="Generate UUIDs, passwords, and Lorem Ipsum text" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Generators feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include UUID generation, secure password creation, and Lorem Ipsum text.
        </p>
      </div>
    </ToolContainer>
  );
}