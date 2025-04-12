import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
    id: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    content: React.ReactNode;
}

interface TabViewProps {
    tabs: Tab[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
}

const TabView: React.FC<TabViewProps> = ({
    tabs,
    defaultValue,
    onChange,
    className
}) => {
    const [activeTab, setActiveTab] = React.useState<string>(defaultValue || tabs[0]?.id || '');

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className={cn("w-full", className)}
        >
            <div className="border-b sticky top-0 bg-background z-10 pb-0">
                <TabsList className="grid grid-flow-col auto-cols-max w-full justify-start px-4 py-2 h-auto bg-transparent border-b-0 gap-6">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className={cn(
                                "inline-flex items-center gap-2 px-1 py-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none relative",
                                "text-sm font-medium transition-colors focus-visible:outline-none data-[state=active]:text-purple-700 text-muted-foreground"
                            )}
                        >
                            {tab.icon && <span className="mr-1">{tab.icon}</span>}
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.span
                                    layoutId="bubble"
                                    className="absolute bottom-0 inset-x-0 h-[2px] bg-purple-700"
                                    style={{ borderRadius: 9999 }}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <div className="mt-4 px-4">
                <AnimatePresence mode="wait">
                    {tabs.map((tab) => (
                        <TabsContent
                            key={tab.id}
                            value={tab.id}
                            className={cn(activeTab === tab.id ? 'block' : 'hidden')}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {tab.content}
                            </motion.div>
                        </TabsContent>
                    ))}
                </AnimatePresence>
            </div>
        </Tabs>
    );
};

export default TabView; 