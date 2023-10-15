package com.google.android.datatransport.runtime.time;

import com.google.android.datatransport.runtime.dagger.internal.Factory;
import com.google.android.datatransport.runtime.dagger.internal.Preconditions;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class TimeModule_EventClockFactory implements Factory<Clock> {

    /* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
    public static final class InstanceHolder {
        private static final TimeModule_EventClockFactory INSTANCE = new TimeModule_EventClockFactory();

        private InstanceHolder() {
        }
    }

    public static TimeModule_EventClockFactory create() {
        return InstanceHolder.INSTANCE;
    }

    public static Clock eventClock() {
        return (Clock) Preconditions.checkNotNull(TimeModule.eventClock(), "Cannot return null from a non-@Nullable @Provides method");
    }

    @Override // javax.inject.Provider
    public Clock get() {
        return eventClock();
    }
}
