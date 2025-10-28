'use client';

import * as React from 'react';
import { Check, Languages } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppContext } from '@/contexts/AppContext';
import type { Language } from '@/lib/types';

const languages: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'bn', label: 'বাংলা' },
];

export function LanguageSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { language, setLanguage } = useAppContext();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Select language">
          <Languages className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    setLanguage(currentValue as Language);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      language === lang.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
