import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

interface Unit {
    value: number;
    label: string;
    plant_id: number;
    status: number;
}

interface User {
    id: string;
    name: string;
    plant_id: number;
    can_access_all_units: boolean;
}

interface Props {
    units: Unit[];
    user: User;
}

export default function SelectUnit({ units, user }: Props) {
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedUnit || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        router.post(route('unit.store'), {
            unit_id: selectedUnit
        }, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    const handleUnitChange = (value: string) => {
        const unitId = parseInt(value);
        setSelectedUnit(unitId);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Successfully logged in, choose a unit
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="w-80">
                            <Select onValueChange={handleUnitChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a unit..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem 
                                            key={unit.value} 
                                            value={unit.value.toString()}
                                        >
                                            {unit.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 justify-start">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={!selectedUnit || isSubmitting}
                            >
                                {isSubmitting ? 'Selecting...' : 'Continue'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
    );
} 