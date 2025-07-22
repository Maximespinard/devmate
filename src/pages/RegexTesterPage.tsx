import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function RegexTesterPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Regex Tester" 
        description="Test and debug regular expressions" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Regex Tester feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include pattern testing, match highlighting, and group extraction.
        </p>
      </div>
    </ToolContainer>
  );
}