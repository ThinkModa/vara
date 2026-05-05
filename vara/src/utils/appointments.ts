import type { Appointment } from '../types/user';

export function formatAppointmentDisplayDate(dateISO: string): string {
  const d = new Date(`${dateISO}T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function isScheduled(a: Appointment): boolean {
  return a.status === 'scheduled';
}

export function getNextAppointment(appointments: Appointment[]): Appointment | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = appointments
    .filter((a) => {
      if (!isScheduled(a)) return false;
      const d = new Date(`${a.dateISO}T12:00:00`);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    })
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.timeLabel.localeCompare(b.timeLabel));
  return upcoming[0] ?? null;
}

export function partitionAppointments(appointments: Appointment[]): {
  upcoming: Appointment[];
  past: Appointment[];
  cancelled: Appointment[];
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cancelled = appointments
    .filter((a) => a.status === 'cancelled')
    .sort((x, y) => y.dateISO.localeCompare(x.dateISO) || y.timeLabel.localeCompare(x.timeLabel));

  const scheduled = appointments.filter(isScheduled);

  const upcoming: Appointment[] = [];
  const past: Appointment[] = [];

  for (const a of scheduled) {
    const d = new Date(`${a.dateISO}T12:00:00`);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() >= today.getTime()) {
      upcoming.push(a);
    } else {
      past.push(a);
    }
  }

  upcoming.sort((x, y) => x.dateISO.localeCompare(y.dateISO));
  past.sort((x, y) => y.dateISO.localeCompare(x.dateISO));

  return { upcoming, past, cancelled };
}
