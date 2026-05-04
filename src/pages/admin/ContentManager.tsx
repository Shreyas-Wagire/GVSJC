import { useState, useEffect } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Image as ImageIcon } from 'lucide-react';

export default function ContentManager() {
  const { contentData, isLoading, updateContent } = useSiteContent();
  const [localData, setLocalData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contentData) {
      const initialMap: Record<string, string> = {};
      contentData.forEach(item => {
        // We assume value is stored as a string or serialized JSON string representation
        initialMap[item.key] = typeof item.value === 'string' ? item.value : JSON.stringify(item.value);
      });
      setLocalData(initialMap);
    }
  }, [contentData]);

  const handleSave = (key: string) => {
    // If the original value had quotes around it, they might need JSON.parse() in standard approach,
    // but here we just store raw string data based on assumptions in useSiteContent.
    const valueToSave = localData[key];
    
    updateContent.mutate({
      key,
      value: valueToSave
    });
  };

  const handleImageUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalData(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading content keys...</div>;
  }

  // Predefine editable sections grouped by section title for better UI
  const editableDefaults = [
    {
      group: 'Homepage Hero',
      keys: [
        { label: 'Hero Background Image', key: 'hero.image', type: 'image' },
        { label: 'Hero Title', key: 'hero.title', type: 'text' },
        { label: 'Hero Subtitle', key: 'hero.subtitle', type: 'textarea' },
      ]
    }
    // Add more groups as needed without changing the backend logic
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in text-left">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Site Content</h1>
        <p className="text-gray-500">Modify the text across the website directly from here. Changes apply immediately.</p>
      </div>

      <div className="space-y-8">
        {editableDefaults.map((section) => (
          <Card key={section.group}>
            <CardHeader>
              <CardTitle>{section.group}</CardTitle>
              <CardDescription>Update text elements within the {section.group} section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.keys.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      {field.type === 'textarea' ? (
                        <Textarea 
                          value={localData[field.key] || ''} 
                          onChange={(e) => setLocalData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          rows={4}
                          placeholder="Enter text..."
                        />
                      ) : field.type === 'image' ? (
                        <div className="space-y-3">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(field.key, e)}
                          />
                          {localData[field.key] && (
                            <div className="relative w-48 h-28 rounded-md overflow-hidden border border-gray-200">
                              <img src={localData[field.key]} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Input 
                          value={localData[field.key] || ''} 
                          onChange={(e) => setLocalData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder="Enter text..."
                        />
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        System Key: <code className="bg-gray-100 px-1 rounded">{field.key}</code>
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleSave(field.key)}
                      disabled={updateContent.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Fallback if DB keys exist but aren't explicitly grouped */}
        {contentData && contentData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Other Database Keys</CardTitle>
              <CardDescription>All other dynamic keys found in the backend not explicitly mapped</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contentData
                .filter(c => !editableDefaults.some(group => group.keys.some(k => k.key === c.key)))
                .map((field) => (
                <div key={field.key} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                  <Label>Key: {field.key}</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <Input 
                        value={localData[field.key] || ''} 
                        onChange={(e) => setLocalData(prev => ({...prev, [field.key]: e.target.value}))}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSave(field.key)}
                      disabled={updateContent.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
