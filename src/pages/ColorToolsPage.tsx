import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function ColorToolsPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Color Tools" 
        description="Convert colors between formats and check contrast" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Color Tools feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include HEX/RGB/HSL conversion and accessibility contrast checking.
        </p>
      </div>
    </ToolContainer>
  );
}