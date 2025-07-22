import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function DiffViewerPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Diff Viewer" 
        description="Compare text and code with side-by-side diff view" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Diff Viewer feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include unified and split view modes with syntax highlighting.
        </p>
      </div>
    </ToolContainer>
  );
}