import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function JwtDecoderPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="JWT Decoder" 
        description="Decode and inspect JWT tokens" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          JWT Decoder feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include token decoding, expiry checking, and signature verification.
        </p>
      </div>
    </ToolContainer>
  );
}