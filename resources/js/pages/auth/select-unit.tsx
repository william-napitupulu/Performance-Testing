import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

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
    units_count: number;
    load_units_url: string;
}

export default function SelectUnit({ units, user, units_count, load_units_url }: Props) {
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLogoutSubmitting, setIsLogoutSubmitting] = useState(false);
    const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
    const [isLoadingUnits, setIsLoadingUnits] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUnit || isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        router.post(
            route('unit.store'),
            {
                unit_id: selectedUnit,
                _token: (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const loadUnits = async () => {
        if (isLoadingUnits) return;
        
        setIsLoadingUnits(true);
        try {
            const response = await fetch(`${load_units_url}?limit=300`, {
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setAvailableUnits(data.units);
        } catch (error) {
            console.error('Failed to load units:', error);
        } finally {
            setIsLoadingUnits(false);
        }
    };

    useEffect(() => {
        // If units are passed directly, use them; otherwise load via API
        if (units && units.length > 0) {
            setAvailableUnits(units);
        } else {
            loadUnits();
        }
    }, []);

    const handleUnitChange = (value: string) => {
        const unitId = parseInt(value);
        setSelectedUnit(unitId);
    };

    const handleLogout = () => {
        if (isLogoutSubmitting) return;
        setIsLogoutSubmitting(true);
        router.post(
            route('logout'),
            {},
            {
                onFinish: () => setIsLogoutSubmitting(false),
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="space-y-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Successfully logged in, choose a unit</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="w-80">
                        <Select onValueChange={handleUnitChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={isLoadingUnits ? "Loading units..." : "Select a unit..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableUnits.map((unit) => (
                                    <SelectItem key={unit.value} value={unit.value.toString()}>
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-start gap-4">
                        <Button type="button" variant="outline" onClick={handleLogout} disabled={isLogoutSubmitting}>
                            {isLogoutSubmitting ? 'Logging out...' : 'Logout'}
                        </Button>

                        <Button type="submit" disabled={!selectedUnit || isSubmitting}>
                            {isSubmitting ? 'Selecting...' : 'Continue'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
