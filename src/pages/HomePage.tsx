import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';

const tools = [
  { id: 'json-formatter', name: 'JSON Formatter', path: '/json-formatter', icon: '{}' },
  { id: 'base64', name: 'Base64 Encoder/Decoder', path: '/base64', icon: '📝' },
  { id: 'jwt-decoder', name: 'JWT Decoder', path: '/jwt-decoder', icon: '🔐' },
  { id: 'url-tools', name: 'URL Tools', path: '/url-tools', icon: '🔗' },
  { id: 'hash-generator', name: 'Hash Generator', path: '/hash-generator', icon: '#️⃣' },
  { id: 'timestamp', name: 'Timestamp Converter', path: '/timestamp', icon: '⏰' },
  { id: 'regex-tester', name: 'Regex Tester', path: '/regex-tester', icon: '🔍' },
  { id: 'diff-viewer', name: 'Diff Viewer', path: '/diff-viewer', icon: '📊' },
  { id: 'color-tools', name: 'Color Tools', path: '/color-tools', icon: '🎨' },
  { id: 'generators', name: 'Generators', path: '/generators', icon: '⚡' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <ToolContainer className="text-center">
      <ToolHeader 
        title="DevMate" 
        description="Premium developer tools playground" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant="ghost"
            onClick={() => navigate(tool.path)}
            className="h-auto p-6 flex flex-col items-center gap-3 text-center hover:scale-105 transition-transform duration-200"
          >
            <span className="text-2xl">{tool.icon}</span>
            <span className="font-medium">{tool.name}</span>
          </Button>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">⌘K</kbd> to open the command palette
        </p>
      </div>
    </ToolContainer>
  );
}