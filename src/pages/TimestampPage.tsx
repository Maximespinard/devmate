import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';

export default function TimestampPage() {
  return (
    <ToolContainer>
      <ToolHeader 
        title="Timestamp Converter" 
        description="Convert timestamps between formats and timezones" 
      />
      
      <div className="glass-panel p-8 text-center">
        <p className="text-muted-foreground">
          Timestamp Converter feature coming soon...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This will include Unix timestamp conversion and timezone support.
        </p>
      </div>
    </ToolContainer>
  );
}