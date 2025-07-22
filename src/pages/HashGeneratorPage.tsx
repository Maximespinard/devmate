import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function HashGeneratorPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Hash Generator" 
        description="Generate MD5, SHA-1, SHA-256, and other hashes" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Hash Generator feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include multiple hash algorithms and file hash support.
        </p>
      </div>
    </ToolContainer>
  );
}