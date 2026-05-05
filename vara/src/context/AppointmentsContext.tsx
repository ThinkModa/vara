import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Appointment } from '../types/user';
import { initialAppointments } from '../data/mockData';

interface AppointmentsContextValue {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, patch: Partial<Omit<Appointment, 'id'>>) => void;
}

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    setAppointments((prev) => [
      ...prev,
      { ...appointment, id: `appt-${Date.now()}`, status: appointment.status ?? 'scheduled' },
    ]);
  }, []);

  const updateAppointment = useCallback((id: string, patch: Partial<Omit<Appointment, 'id'>>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  }, []);

  const value = useMemo(
    () => ({ appointments, addAppointment, updateAppointment }),
    [appointments, addAppointment, updateAppointment]
  );

  return (
    <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
  );
}

export function useAppointments(): AppointmentsContextValue {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) {
    throw new Error('useAppointments must be used within AppointmentsProvider');
  }
  return ctx;
}
