import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function JsonFormatterPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="JSON Formatter" 
        description="Format, validate, and convert JSON data" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          JSON Formatter feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include formatting, validation, minification, and conversion to TypeScript interfaces.
        </p>
      </div>
    </ToolContainer>
  );
}