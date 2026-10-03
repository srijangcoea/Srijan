import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildRegistrationSchema } from '../utils/registrationSchema';
import { submitRegistration, syncLocalPendingRegistrations } from '../services/registrationService';
import { notify } from '../utils/toast';

/**
 * Custom Hook: useRegistration
 * 
 * Manages:
 * - Event pre-selection via URL search param (?event=HACK) or route param (/register/:eventId)
 * - Dynamic Zod validation schema generation
 * - Preserving complementary member entries across team size adjustments
 * - Submission lifecycle, duplicate check, and error toast state
 */
export function useRegistration(eventsList = []) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { eventId: routeParamId } = useParams();

  // Find initial event based on ?event=<CODE> or route param or first event
  const initialEvent = useMemo(() => {
    const urlEventCode = searchParams.get('event')?.trim().toUpperCase();
    if (urlEventCode) {
      const match = eventsList.find(
        (e) => (e.code || '').toUpperCase() === urlEventCode || e.id.toUpperCase() === urlEventCode
      );
      if (match) return match;
    }

    if (routeParamId) {
      const match = eventsList.find(
        (e) =>
          e.id.toLowerCase() === routeParamId.toLowerCase() ||
          e.id.toLowerCase() === `event-${routeParamId.toLowerCase()}` ||
          (e.code || '').toLowerCase() === routeParamId.toLowerCase()
      );
      if (match) return match;
    }

    return eventsList[0] || null;
  }, [searchParams, routeParamId, eventsList]);

  const [selectedEvent, setSelectedEvent] = useState(initialEvent);

  // Team Size state (driven strictly by minTeamSize & maxTeamSize)
  const isTeamEvent = (selectedEvent?.maxTeamSize || 1) > 1;
  const minSlots = selectedEvent?.minTeamSize || 1;
  const maxSlots = selectedEvent?.maxTeamSize || 1;

  const [teamSize, setTeamSize] = useState(isTeamEvent ? minSlots : 1);

  // Submission & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const [successData, setSuccessData] = useState(null);

  // Persistent buffer to preserve entered member data across team size changes
  const memberBufferRef = useRef([
    { name: '', email: '', phone: '', department: '', year: '' },
    { name: '', email: '', phone: '', department: '', year: '' },
    { name: '', email: '', phone: '', department: '', year: '' },
  ]);

  // Build dynamic Zod Schema based on current event and teamSize
  const currentSchema = useMemo(() => {
    return buildRegistrationSchema(selectedEvent, teamSize);
  }, [selectedEvent, teamSize]);

  // React Hook Form initialization
  const form = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onTouched',
    defaultValues: {
      eventId: selectedEvent?.id || '',
      eventCode: selectedEvent?.code || '',
      teamName: '',
      teamSize: isTeamEvent ? teamSize : 1,
      leader: {
        name: '',
        email: '',
        phone: '',
        department: '',
        year: '',
      },
      members: [],
    },
  });

  const { register, handleSubmit, reset, setValue, getValues, watch, formState } = form;

  // On mount, auto-sync any pending registrations that failed earlier
  useEffect(() => {
    syncLocalPendingRegistrations().then((count) => {
      if (count > 0) {
        console.log(`Synced ${count} offline registration(s) to database.`);
      }
    }).catch(() => {});
  }, []);

  // When selected event changes, update URL param and form defaults
  useEffect(() => {
    if (selectedEvent) {
      const newIsTeam = (selectedEvent.maxTeamSize || 1) > 1;
      const initialSlots = newIsTeam ? selectedEvent.minTeamSize || 2 : 1;
      setTeamSize(initialSlots);

      setValue('eventId', selectedEvent.id);
      setValue('eventCode', selectedEvent.code);
      setValue('teamSize', initialSlots);

      // Pre-fill members from buffer
      if (newIsTeam) {
        const neededMembers = memberBufferRef.current.slice(0, initialSlots - 1);
        setValue('members', neededMembers);
      } else {
        setValue('members', []);
        setValue('teamName', '');
      }

      // Update URL query param ?event=<CODE>
      if (selectedEvent.code) {
        setSearchParams({ event: selectedEvent.code }, { replace: true });
      }
    }
  }, [selectedEvent, setValue, setSearchParams]);

  // Handle Event Change from Grid
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setErrorToast(null);
  };

  // Handle Team Size Change (preserving buffer data)
  const handleTeamSizeChange = (newSize) => {
    if (newSize < minSlots || newSize > maxSlots) return;

    // Cache current member values into buffer
    const currentMembers = getValues('members') || [];
    currentMembers.forEach((m, idx) => {
      if (m && memberBufferRef.current[idx]) {
        memberBufferRef.current[idx] = { ...memberBufferRef.current[idx], ...m };
      }
    });

    setTeamSize(newSize);
    setValue('teamSize', newSize, { shouldValidate: true });

    // Slice from preserved buffer
    const updatedMembers = memberBufferRef.current.slice(0, newSize - 1);
    setValue('members', updatedMembers, { shouldValidate: true });
  };

  // Form Submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorToast(null);

    try {
      const result = await submitRegistration(data, selectedEvent);
      if (result.success) {
        setSuccessData(result.data);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        notify.success(
          'Registration Confirmed',
          `Transaction ID: #${result.data.registrationId}`
        );
      }
    } catch (err) {
      console.error('Registration dispatch error:', err);
      const msg = err.message || 'Failed to submit registration. Please verify parameters.';
      setErrorToast(msg);
      notify.error('Registration Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset for "Register for Another Event"
  const handleRegisterAnother = () => {
    setSuccessData(null);
    setErrorToast(null);
    memberBufferRef.current = [
      { name: '', email: '', phone: '', department: '', year: '' },
      { name: '', email: '', phone: '', department: '', year: '' },
      { name: '', email: '', phone: '', department: '', year: '' },
    ];
    reset({
      eventId: selectedEvent?.id || '',
      eventCode: selectedEvent?.code || '',
      teamName: '',
      teamSize: isTeamEvent ? minSlots : 1,
      leader: { name: '', email: '', phone: '', department: '', year: '' },
      members: isTeamEvent ? memberBufferRef.current.slice(0, minSlots - 1) : [],
    });
  };

  return {
    form,
    selectedEvent,
    isTeamEvent,
    minSlots,
    maxSlots,
    teamSize,
    isSubmitting,
    errorToast,
    setErrorToast,
    successData,
    handleSelectEvent,
    handleTeamSizeChange,
    onSubmit: handleSubmit(onSubmit),
    handleRegisterAnother,
    register,
    setValue,
    watch,
    errors: formState.errors,
  };
}
