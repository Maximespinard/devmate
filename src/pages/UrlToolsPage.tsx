import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function UrlToolsPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="URL Tools" 
        description="Encode, decode, and build URLs" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          URL Tools feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include URL encoding/decoding and query parameter building.
        </p>
      </div>
    </ToolContainer>
  );
}