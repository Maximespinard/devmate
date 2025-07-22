import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function Base64Page() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Base64 Encoder/Decoder" 
        description="Encode and decode Base64 text and files" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Base64 tool feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include text and file encoding/decoding with drag & drop support.
        </p>
      </div>
    </ToolContainer>
  );
}